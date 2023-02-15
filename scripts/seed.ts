import type { Prisma } from '@prisma/client'
import { db } from 'api/src/lib/db'
import CryptoJS from 'crypto-js'

import { Marker } from '$web/types/graphql'

// -----------------------------------------------------------------------------------------
// DATA
// -------------------------------------------------------------------------------------
// SEED USERS DATA
// -------------------------------------------------------------------------------------
const USERS: Partial<Prisma.UserCreateInput>[] = [
  {
    id: '1',
    name: 'Admin',
    email: 'admin@greenkraine.io',
    roles: 'ADMIN',
  },
  {
    id: '2',
    name: 'Moderator',
    email: 'moderator@greenkraine.io',
    roles: 'MODERATOR',
  },
  {
    id: '3',
    name: 'Analyst',
    email: 'analyst@greenkraine.io',
    roles: 'ANALYST',
  },
  {
    id: '4',
    name: 'User',
    email: 'user@greenkraine.io',
    roles: 'USER',
  },
]
const NEW_PASSWORD = 'HelloGK1'
// -------------------------------------------------------------------------------------
// SEED MARKERS DATA
// -------------------------------------------------------------------------------------
const MARKERS: Partial<Marker>[] = [
  {
    id: '1',
    lat: 47.69273605567288,
    lng: 32.50885009766171,
    userId: '4',
  },
  {
    id: '2',
    lat: 48.67273605567288,
    lng: 24.95088500976562,
    userId: '4',
  },
  {
    id: '3',
    lat: 48.79173625267288,
    lng: 32.80885009766171,
    userId: '4',
  },
  {
    id: '4',
    lat: 49.68273605561111,
    lng: 23.75088500971111,
    userId: '4',
  },
  {
    id: '5',
    lat: 49.69273605567288,
    lng: 23.96885009765617,
    userId: '4',
  },
  {
    id: '6',
    lat: 49.62263605567281,
    lng: 30.50885009766171,
    userId: '4',
  },
  {
    id: '7',
    lat: 48.69273605567111,
    lng: 24.85088500976111,
    userId: '4',
  },
  {
    id: '8',
    lat: 49.68273605567288,
    lng: 23.93885009765617,
    userId: '4',
  },
  {
    id: '9',
    lat: 49.67263605567281,
    lng: 30.52885009766171,
    userId: '4',
  },
  {
    id: '10',
    lat: 48.99273605567111,
    lng: 24.85088577976111,
    userId: '4',
  },
]
// -----------------------------------------------------------------------------------------
const createUsers = async () => {
  for (const user of USERS) {
    const salt = CryptoJS.lib.WordArray.random(128 / 8).toString()
    const hashedPassword = CryptoJS.PBKDF2(NEW_PASSWORD, salt, {
      keySize: 256 / 32,
    }).toString()
    await db.user.create({
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
        salt,
        hashedPassword,
      },
    })
  }
}

const createMarkers = async () => {
  for (const marker of MARKERS) {
    await db.marker.create({
      data: {
        lat: marker.lat,
        lng: marker.lng,
        user: {
          connect: {
            id: marker.userId,
          },
        },
      },
    })
  }
}

const clearDatabase = async () => {
  await db.marker.deleteMany()
  await db.user.deleteMany()
}

export default async () => {
  try {
    await clearDatabase()
    await createUsers()
    await createMarkers()
  } catch (error) {
    console.warn('Please define your seed data.')
    console.error(error)
  }
}
