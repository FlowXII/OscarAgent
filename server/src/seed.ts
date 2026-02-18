import { prisma } from './db.js';

export async function seedSkills() {
  const defaultSkills = [
    {
      name: 'Navigation Web Pro',
      slug: 'web-browsing',
      description: 'Permet à Oscar de naviguer sur le web, comparer les prix et réserver des services en temps réel.',
      defaultEnabled: true,
      category: 'Intelligence',
    },
    {
      name: 'Gestionnaire de Correspondance',
      slug: 'email-admin',
      description: 'Oscar peut lire, trier et rédiger des brouillons de courriels pour vos communications prioritaires.',
      defaultEnabled: true,
      category: 'Productivité',
    },
    {
      name: 'Maître du Temps',
      slug: 'calendar-sync',
      description: 'Synchronisation complète de vos agendas pour la détection automatique de conflits et la prise de rendez-vous.',
      defaultEnabled: false,
      category: 'Productivité',
    },
    {
      name: 'Conciergerie Haut de Gamme',
      slug: 'luxury-concierge',
      description: 'Accès exclusif à des bases de données de services de luxe (hôtels 5*, jets privés, restaurants étoilés).',
      defaultEnabled: false,
      category: 'Privilèges',
    },
    {
      name: 'Coffre-fort Digital',
      slug: 'secure-vault',
      description: 'Stockage ultra-sécurisé de vos documents sensibles et informations de paiement.',
      defaultEnabled: false,
      category: 'Sécurité',
    }
  ];

  for (const skill of defaultSkills) {
    await prisma.skill.upsert({
      where: { slug: skill.slug },
      update: {},
      create: skill,
    });
  }

  console.log('Skills seeded successfully');
}
