-- ========================================
-- GÎTE MASTER v2.0 - SCHÉMA SUPABASE
-- ========================================
-- À exécuter dans l'éditeur SQL de Supabase
-- Dashboard → SQL Editor → New Query
-- ========================================

-- ========== TABLE: BOOKINGS ==========
CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  property_id TEXT NOT NULL,
  property_name TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('confirmed', 'pending', 'cancelled')),
  total_price DECIMAL(10, 2) NOT NULL,
  guests INTEGER NOT NULL,
  adults INTEGER NOT NULL,
  children INTEGER DEFAULT 0,
  notes TEXT,
  source TEXT NOT NULL CHECK (source IN ('direct', 'airbnb', 'booking', 'manual')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherches rapides
CREATE INDEX IF NOT EXISTS idx_bookings_check_in ON bookings(check_in);
CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- ========== TABLE: PROPERTIES ==========
CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('villa', 'appartement', 'gite', 'chambre', 'studio')),
  address JSONB NOT NULL,
  capacity JSONB NOT NULL,
  pricing JSONB NOT NULL,
  wifi JSONB,
  access JSONB,
  amenities TEXT[],
  photos TEXT[],
  description JSONB,
  rules TEXT[],
  is_active BOOLEAN DEFAULT true,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherches
CREATE INDEX IF NOT EXISTS idx_properties_is_active ON properties(is_active);
CREATE INDEX IF NOT EXISTS idx_properties_type ON properties(type);

-- ========== TABLE: CLEANING_TASKS ==========
CREATE TABLE IF NOT EXISTS cleaning_tasks (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL,
  guest_name TEXT NOT NULL,
  property_name TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  scheduled_time TIME NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'assigned', 'in-progress', 'completed')),
  assigned_to TEXT,
  assigned_phone TEXT,
  cost DECIMAL(10, 2) NOT NULL,
  checklist JSONB NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherches
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_scheduled_date ON cleaning_tasks(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_status ON cleaning_tasks(status);
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_booking_id ON cleaning_tasks(booking_id);

-- ========== TABLE: PAYMENTS (STRIPE) ==========
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL,
  stripe_payment_id TEXT UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'eur',
  type TEXT NOT NULL CHECK (type IN ('booking', 'deposit', 'additional')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'succeeded', 'failed', 'cancelled', 'refunded')),
  payment_method TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherches
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_id ON payments(stripe_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- ========== TABLE: MESSAGES ==========
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  booking_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('email', 'sms', 'whatsapp')),
  template TEXT NOT NULL,
  recipient TEXT NOT NULL,
  subject TEXT,
  body TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'failed', 'delivered', 'opened')),
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherches
CREATE INDEX IF NOT EXISTS idx_messages_booking_id ON messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);
CREATE INDEX IF NOT EXISTS idx_messages_sent_at ON messages(sent_at);

-- ========== TABLE: EXPENSES ==========
CREATE TABLE IF NOT EXISTS expenses (
  id TEXT PRIMARY KEY,
  property_id TEXT,
  category TEXT NOT NULL CHECK (category IN ('ménage', 'maintenance', 'fournitures', 'électricité', 'eau', 'internet', 'taxe', 'assurance', 'autre')),
  amount DECIMAL(10, 2) NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL,
  vendor TEXT,
  receipt_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherches
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_property_id ON expenses(property_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);

-- ========== FONCTIONS ==========

-- Fonction de mise à jour du timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers pour auto-update
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_properties_updated_at
  BEFORE UPDATE ON properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_cleaning_tasks_updated_at
  BEFORE UPDATE ON cleaning_tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_expenses_updated_at
  BEFORE UPDATE ON expenses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- ========== RLS (ROW LEVEL SECURITY) ==========
-- Activez RLS pour sécuriser vos tables

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE cleaning_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Politiques d'accès (à personnaliser selon vos besoins)
-- Exemple: Permettre lecture/écriture pour utilisateurs authentifiés

CREATE POLICY "Enable all for authenticated users" ON bookings
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users" ON properties
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users" ON cleaning_tasks
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users" ON payments
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users" ON messages
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users" ON expenses
  FOR ALL USING (auth.role() = 'authenticated');

-- ========== STORAGE BUCKET (Photos) ==========
-- Créez un bucket pour les photos des propriétés
-- Dashboard → Storage → Create Bucket
-- Nom: property-photos
-- Public: true

-- ========== VIEWS UTILES ==========

-- Vue: Statistiques mensuelles
CREATE OR REPLACE VIEW monthly_stats AS
SELECT 
  DATE_TRUNC('month', check_in) as month,
  COUNT(*) as total_bookings,
  SUM(total_price) as total_revenue,
  AVG(total_price) as avg_booking_value,
  SUM(guests) as total_guests
FROM bookings
WHERE status = 'confirmed'
GROUP BY DATE_TRUNC('month', check_in)
ORDER BY month DESC;

-- Vue: Tâches en attente
CREATE OR REPLACE VIEW pending_tasks AS
SELECT 
  ct.*,
  b.guest_name,
  b.guest_phone,
  b.check_out
FROM cleaning_tasks ct
JOIN bookings b ON ct.booking_id = b.id
WHERE ct.status IN ('pending', 'assigned')
ORDER BY ct.scheduled_date ASC;

-- ========== DONNÉES DE TEST (OPTIONNEL) ==========

-- Insérer une propriété test
INSERT INTO properties (id, name, type, address, capacity, pricing, wifi, access, amenities, description, rules, is_active, is_published)
VALUES (
  'prop_test_001',
  'Villa Test',
  'villa',
  '{"street": "123 Rue Test", "city": "Nice", "zipCode": "06000", "country": "France"}'::jsonb,
  '{"guests": 4, "bedrooms": 2, "beds": 2, "bathrooms": 1}'::jsonb,
  '{"basePrice": 120, "cleaningFee": 50, "deposit": 500, "minStay": 2}'::jsonb,
  '{"ssid": "Villa-WiFi", "password": "test123"}'::jsonb,
  '{"gateCode": "1234", "keyBoxCode": "5678", "checkInTime": "16:00", "checkOutTime": "11:00", "instructions": "Test"}'::jsonb,
  ARRAY['WiFi', 'Cuisine', 'TV', 'Parking'],
  '{"short": "Villa test", "long": "Description longue"}'::jsonb,
  ARRAY['Non fumeur', 'Pas d''animaux'],
  true,
  false
) ON CONFLICT (id) DO NOTHING;

-- ========== NOTES D'UTILISATION ==========
/*
1. Copiez ce script dans l'éditeur SQL de Supabase
2. Exécutez-le (Run)
3. Vérifiez la création des tables dans Table Editor
4. Configurez les clés API dans l'app (Admin → Intégrations)
5. Testez la connexion
6. Migrez vos données depuis localStorage

IMPORTANT: 
- Les policies RLS sont permissives par défaut
- À personnaliser selon votre authentification
- En production, restreignez les accès
*/
