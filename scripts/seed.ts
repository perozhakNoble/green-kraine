import type { Prisma } from '@prisma/client'
import { db } from 'api/src/lib/db'
import CryptoJS from 'crypto-js'

import { Marker } from '$web/types/graphql'

const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min)
}

const randomSliceOfArray = <T>(array: Array<T>): Array<T> => {
  return array
    .sort((_a, _b) => 0.5 - Math.random())
    .slice(
      randomNumber(0, Math.floor(array.length / 2)),
      randomNumber(Math.floor(array.length / 2), array.length)
    )
}

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
// SEED CATEGOTIES DATA
// -------------------------------------------------------------------------------------
const CATEGORIES = [
  {
    name: 'Забруднення',
  },
  {
    name: 'Знищення лісів і середовища проживання',
  },
  {
    name: 'Поводження з відходами',
  },
  { name: 'Хімічні розливи та небезпечні відходи' },
  { name: 'Браконьєрство' },
] as const
type CategoryType = (typeof CATEGORIES)[number]['name']
// -------------------------------------------------------------------------------------
// SEED MARKERS DATA
// -------------------------------------------------------------------------------------
const MARKERS: Partial<
  Marker & {
    category: CategoryType
    problemDescription: string
    problemTitle: string
  }
>[] = [
  {
    id: '1',
    lat: 47.69273605567288,
    lng: 32.50885009766171,
    userId: '1',
    category: 'Браконьєрство',
    problemTitle: 'Незаконний вилов риби',
    problemDescription:
      'Браконьєри виловлюють рибу у незаконному місці, у великих обсягах, це загрожує знищенню екосистеми озера',
  },
  {
    id: '2',
    lat: 48.67273605567288,
    lng: 24.95088500976562,
    userId: '2',
    category: 'Забруднення',
    problemTitle: 'Забруднення повітря',
    problemDescription:
      'Постійні затори, внаслідок чого великі викиди газів у повітря',
  },
  {
    id: '3',
    lat: 48.79173625267288,
    lng: 32.80885009766171,
    userId: '3',
    category: 'Знищення лісів і середовища проживання',
    problemTitle: 'Вирубка лісу',
    problemDescription: 'Незаконне вирубування лісів у власних цілях',
  },
  {
    id: '4',
    lat: 49.68273605561111,
    lng: 23.75088500971111,
    userId: '4',
    category: 'Поводження з відходами',
    problemTitle: 'Купи сміття',
    problemDescription:
      'Комунальники не вивозять сміття, або роблять це дуже рідко, внаслідок чого смітиники завалені, і на вулиці неможливо знаходитись',
  },
  {
    id: '5',
    lat: 49.69273605567288,
    lng: 23.96885009765617,
    userId: '4',
    category: 'Знищення лісів і середовища проживання',
    problemTitle: 'Вирубка лісу',
    problemDescription: 'Незаконне вирубування лісів у власних цілях',
  },
  {
    id: '6',
    lat: 49.62263605567281,
    lng: 30.50885009766171,
    userId: '4',
    category: 'Хімічні розливи та небезпечні відходи',
    problemTitle: 'Викиди хімії',
    problemDescription: 'Завод AТБ викидає купу відходів у повітря та грунт',
  },
  {
    id: '7',
    lat: 48.69273605567111,
    lng: 24.85088500976111,
    userId: '1',
    category: 'Забруднення',
    problemTitle: 'Забруднення повітря',
    problemDescription:
      'Люди масово використовують генератори, які забруднюють повітря',
  },
  {
    id: '8',
    lat: 49.68273605567288,
    lng: 23.93885009765617,
    userId: '3',
    category: 'Поводження з відходами',
    problemTitle: 'Купи сміття',
    problemDescription:
      'Комунальники не вивозять сміття, або роблять це дуже рідко, внаслідок чого смітиники завалені, і на вулиці неможливо знаходитись',
  },
  {
    id: '9',
    lat: 49.67263605567281,
    lng: 30.52885009766171,
    userId: '2',
    category: 'Забруднення',
    problemTitle: 'Забруднення повітря',
    problemDescription:
      'Люди масово використовують генератори, які забруднюють повітря',
  },
  {
    id: '10',
    lat: 48.99273605567111,
    lng: 24.85088577976111,
    userId: '4',
    category: 'Браконьєрство',
    problemTitle: 'Вбивство зайців',
    problemDescription: 'Браконьєри масово вбивають зайців',
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

const createMarkersAndProblems = async () => {
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
        problem: {
          create: {
            category: {
              connect: {
                name: marker.category,
              },
            },
            description: marker.problemDescription,
            title: marker.problemTitle,
          },
        },
      },
    })
  }
}

const createCategories = async () => {
  for (const category of CATEGORIES) {
    await db.category.create({
      data: {
        name: category.name,
      },
    })
  }
}

const createVotes = async () => {
  const users = await db.user.findMany()
  const problems = await db.problem.findMany()

  let i = 0
  for (const problem of problems) {
    for (const user of randomSliceOfArray(users)) {
      await db.vote.create({
        data: {
          upvote: i++ % 2 === 0,
          user: {
            connect: {
              id: user.id,
            },
          },
          problem: {
            connect: {
              id: problem.id,
            },
          },
        },
      })
    }
  }
}

const clearDatabase = async () => {
  await db.vote.deleteMany()
  await db.image.deleteMany()
  await db.comment.deleteMany()
  await db.problem.deleteMany()
  await db.marker.deleteMany()
  await db.category.deleteMany()
  await db.user.deleteMany()
}

export default async () => {
  try {
    await clearDatabase()
    await createUsers()
    await createCategories()
    await createMarkersAndProblems()
    await createVotes()
  } catch (error) {
    console.warn('Please define your seed data.')
    console.error(error)
  }
}
