-- ================================================
-- SCHÉMA DE BASE DE DONNÉES POUR GÎTE MASTER
-- Base de données: PostgreSQL (Supabase)
-- ================================================

-- ================================================
-- 1. TABLE: properties (Propriétés)
-- ================================================
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  price_per_night DECIMAL(10,2) NOT NULL,
  capacity INTEGER NOT NULL,
  amenities TEXT[], -- Array de string
  
  -- Taxe de séjour
  tourist_tax_rate DECIMAL(4,2) DEFAULT 0.80,
  tourist_tax_city VARCHAR(100),
  
  -- Métadonnées
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Index pour les recherches
CREATE INDEX idx_properties_active ON properties(is_active);

-- ================================================
-- 2. TABLE: reservations (Réservations)
-- ================================================
CREATE TABLE IF NOT EXISTS reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  
  -- Informations du voyageur
  guest_name VARCHAR(255) NOT NULL,
  guest_email VARCHAR(255) NOT NULL,
  guest_phone VARCHAR(50),
  guest_count INTEGER DEFAULT 1,
  
  -- Dates
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  
  -- Statut et source
  status VARCHAR(50) DEFAULT 'confirmed',
  -- confirmed, blocked, cleaning, cancelled
  source VARCHAR(50) DEFAULT 'direct',
  -- direct, airbnb, booking, vrbo
  
  -- Prix
  total_price DECIMAL(10,2),
  tourist_tax_amount DECIMAL(10,2),
  tourist_tax_paid BOOLEAN DEFAULT FALSE,
  
  -- Paiement Stripe
  stripe_session_id VARCHAR(255),
  stripe_payment_intent_id VARCHAR(255),
  payment_status VARCHAR(50),
  -- pending, paid, refunded
  
  -- Métadonnées
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Contraintes
  CONSTRAINT check_dates CHECK (check_out > check_in),
  CONSTRAINT check_guest_count CHECK (guest_count > 0)
);

-- Index pour les recherches fréquentes
CREATE INDEX idx_reservations_property ON reservations(property_id);
CREATE INDEX idx_reservations_dates ON reservations(check_in, check_out);
CREATE INDEX idx_reservations_status ON reservations(status);
CREATE INDEX idx_reservations_source ON reservations(source);

-- ================================================
-- 3. TABLE: expenses (Dépenses)
-- ================================================
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  
  category VARCHAR(50) NOT NULL,
  -- maintenance, supplies, utilities, tax, other
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  date DATE NOT NULL,
  
  -- Reçu / Facture
  receipt_url TEXT,
  receipt_uploaded_at TIMESTAMP,
  
  -- Métadonnées
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT check_amount CHECK (amount >= 0)
);

CREATE INDEX idx_expenses_property ON expenses(property_id);
CREATE INDEX idx_expenses_date ON expenses(date);
CREATE INDEX idx_expenses_category ON expenses(category);

-- ================================================
-- 4. TABLE: channels (Canaux de distribution)
-- ================================================
CREATE TABLE IF NOT EXISTS channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  
  name VARCHAR(255) NOT NULL,
  platform VARCHAR(50) NOT NULL,
  -- airbnb, booking, vrbo, other
  
  -- iCal URLs
  ical_url_import TEXT,
  -- URL pour importer le calendrier depuis la plateforme
  ical_url_export TEXT,
  -- URL à donner à la plateforme
  
  -- Synchronisation
  last_sync TIMESTAMP,
  sync_status VARCHAR(50) DEFAULT 'active',
  -- active, error, disconnected
  sync_error_message TEXT,
  
  -- Métadonnées
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_channels_property ON channels(property_id);

-- ================================================
-- 5. TABLE: messages (Messages / Conversations)
-- ================================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL,
  -- Groupe les messages d'une même conversation
  
  sender VARCHAR(50) NOT NULL,
  -- host, guest, system
  content TEXT NOT NULL,
  
  timestamp TIMESTAMP DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE,
  
  -- Métadonnées
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);

-- ================================================
-- 6. TABLE: conversations (Conversations avec voyageurs)
-- ================================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  
  guest_name VARCHAR(255) NOT NULL,
  source VARCHAR(50) NOT NULL,
  -- direct, airbnb, booking, vrbo
  
  last_message TEXT,
  last_message_date TIMESTAMP,
  unread_count INTEGER DEFAULT 0,
  
  -- Métadonnées
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_conversations_reservation ON conversations(reservation_id);
CREATE INDEX idx_conversations_property ON conversations(property_id);

-- ================================================
-- 7. TABLE: message_templates (Templates d'automatisation)
-- ================================================
CREATE TABLE IF NOT EXISTS message_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  title VARCHAR(255) NOT NULL,
  
  trigger VARCHAR(50) NOT NULL,
  -- booking_confirmed, before_checkin, after_checkout
  days_offset INTEGER DEFAULT 0,
  -- Nombre de jours avant/après le déclencheur
  
  content TEXT NOT NULL,
  -- Contenu avec variables: {{guest_name}}, {{check_in}}, etc.
  
  is_active BOOLEAN DEFAULT TRUE,
  
  -- Stats d'utilisation
  times_sent INTEGER DEFAULT 0,
  last_sent_at TIMESTAMP,
  
  -- Métadonnées
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_templates_trigger ON message_templates(trigger);
CREATE INDEX idx_templates_active ON message_templates(is_active);

-- ================================================
-- 8. TABLE: sent_messages_log (Historique des envois)
-- ================================================
CREATE TABLE IF NOT EXISTS sent_messages_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  template_id UUID REFERENCES message_templates(id) ON DELETE SET NULL,
  reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
  
  recipient_email VARCHAR(255),
  recipient_phone VARCHAR(50),
  
  content TEXT,
  
  email_sent BOOLEAN DEFAULT FALSE,
  email_sent_at TIMESTAMP,
  
  sms_sent BOOLEAN DEFAULT FALSE,
  sms_sent_at TIMESTAMP,
  
  error_message TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_sent_messages_template ON sent_messages_log(template_id);
CREATE INDEX idx_sent_messages_reservation ON sent_messages_log(reservation_id);

-- ================================================
-- 9. TABLE: inventory_items (Stock / Inventaire)
-- ================================================
CREATE TABLE IF NOT EXISTS inventory_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  
  name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  threshold INTEGER NOT NULL DEFAULT 5,
  -- Seuil d'alerte
  unit VARCHAR(50),
  -- unité, bouteille, rouleau, etc.
  
  -- Métadonnées
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT check_quantity CHECK (quantity >= 0),
  CONSTRAINT check_threshold CHECK (threshold >= 0)
);

CREATE INDEX idx_inventory_property ON inventory_items(property_id);

-- ================================================
-- 10. TABLE: maintenance_tickets (Tickets de maintenance)
-- ================================================
CREATE TABLE IF NOT EXISTS maintenance_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  
  title VARCHAR(255) NOT NULL,
  description TEXT,
  
  status VARCHAR(50) DEFAULT 'new',
  -- new, in_progress, resolved
  priority VARCHAR(50) DEFAULT 'medium',
  -- low, medium, high
  
  cost DECIMAL(10,2),
  image_url TEXT,
  
  created_at TIMESTAMP DEFAULT NOW(),
  resolved_at TIMESTAMP,
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tickets_property ON maintenance_tickets(property_id);
CREATE INDEX idx_tickets_status ON maintenance_tickets(status);

-- ================================================
-- 11. TABLE: cleaning_sessions (Sessions de ménage)
-- ================================================
CREATE TABLE IF NOT EXISTS cleaning_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  
  cleaner_name VARCHAR(255) NOT NULL,
  scheduled_date TIMESTAMP NOT NULL,
  
  status VARCHAR(50) DEFAULT 'pending',
  -- pending, completed
  
  -- Rapport
  damages TEXT,
  low_stock_items TEXT[],
  completed_at TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cleaning_reservation ON cleaning_sessions(reservation_id);
CREATE INDEX idx_cleaning_property ON cleaning_sessions(property_id);
CREATE INDEX idx_cleaning_status ON cleaning_sessions(status);

-- ================================================
-- 12. TABLE: users (Utilisateurs de l'app)
-- ================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  
  role VARCHAR(50) DEFAULT 'owner',
  -- owner, cleaner, admin
  
  full_name VARCHAR(255),
  phone VARCHAR(50),
  
  -- Métadonnées
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- ================================================
-- FUNCTIONS & TRIGGERS
-- ================================================

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer le trigger sur toutes les tables pertinentes
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_channels_updated_at BEFORE UPDATE ON channels
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_templates_updated_at BEFORE UPDATE ON message_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_inventory_updated_at BEFORE UPDATE ON inventory_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON maintenance_tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cleaning_updated_at BEFORE UPDATE ON cleaning_sessions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- DONNÉES DE TEST (Optionnel)
-- ================================================

-- Insérer quelques propriétés de test
INSERT INTO properties (name, address, description, price_per_night, capacity, amenities, tourist_tax_rate, tourist_tax_city, image_url)
VALUES 
  ('Villa Lavande', '42 Rue des Oliviers, 06400 Cannes', 'Magnifique villa avec piscine et vue mer', 250.00, 6, ARRAY['Piscine', 'Wifi', 'Climatisation', 'Parking'], 2.30, 'Cannes', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6'),
  ('Appartement Cosy Centre-Ville', '15 Avenue Jean Médecin, 06000 Nice', 'Appartement moderne en plein coeur de Nice', 120.00, 4, ARRAY['Wifi', 'Climatisation', 'Balcon'], 2.53, 'Nice', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688');

-- ================================================
-- VIEWS (Vues utiles)
-- ================================================

-- Vue: Revenus par propriété et par mois
CREATE OR REPLACE VIEW monthly_revenue_by_property AS
SELECT 
  p.id as property_id,
  p.name as property_name,
  DATE_TRUNC('month', r.check_in) as month,
  COUNT(r.id) as reservations_count,
  SUM(r.total_price) as total_revenue,
  SUM(r.tourist_tax_amount) as total_tourist_tax
FROM properties p
LEFT JOIN reservations r ON p.id = r.property_id
WHERE r.status = 'confirmed'
GROUP BY p.id, p.name, DATE_TRUNC('month', r.check_in)
ORDER BY month DESC, property_name;

-- Vue: Dépenses par propriété et par catégorie
CREATE OR REPLACE VIEW expenses_by_category AS
SELECT 
  p.id as property_id,
  p.name as property_name,
  e.category,
  COUNT(e.id) as expense_count,
  SUM(e.amount) as total_amount
FROM properties p
LEFT JOIN expenses e ON p.id = e.property_id
GROUP BY p.id, p.name, e.category
ORDER BY property_name, total_amount DESC;

-- Vue: Taux d'occupation par propriété
CREATE OR REPLACE VIEW occupancy_rate AS
SELECT 
  p.id as property_id,
  p.name as property_name,
  COUNT(DISTINCT r.id) as total_reservations,
  SUM(r.check_out - r.check_in) as total_nights_booked,
  ROUND((SUM(r.check_out - r.check_in)::DECIMAL / 365) * 100, 2) as occupancy_rate_percent
FROM properties p
LEFT JOIN reservations r ON p.id = r.property_id 
WHERE r.status = 'confirmed'
  AND r.check_in >= CURRENT_DATE - INTERVAL '1 year'
GROUP BY p.id, p.name
ORDER BY occupancy_rate_percent DESC;

-- ================================================
-- COMMENTAIRES
-- ================================================

COMMENT ON TABLE properties IS 'Liste des propriétés (gîtes, appartements, villas)';
COMMENT ON TABLE reservations IS 'Réservations confirmées et bloquées';
COMMENT ON TABLE expenses IS 'Dépenses et factures pour chaque propriété';
COMMENT ON TABLE message_templates IS 'Templates pour l''automatisation des emails/SMS';
COMMENT ON COLUMN reservations.tourist_tax_amount IS 'Montant de la taxe de séjour en euros';
COMMENT ON COLUMN properties.tourist_tax_rate IS 'Taux de taxe de séjour par personne et par nuit';

-- ================================================
-- FIN DU SCHÉMA
-- ================================================

-- Pour exécuter ce fichier dans Supabase:
-- 1. Allez dans SQL Editor
-- 2. Collez ce contenu
-- 3. Cliquez sur "Run"
