import { Question } from './models/question.model.js'
import { sequelize } from './core/db.js'
import './core/initModels.js'
import { Attributes } from 'sequelize'

async function seedQuestions() {
  try {
    await sequelize.authenticate()
    await sequelize.sync()

    const questions = [
      {
        text: "Bir nechta qalam va bitta daftarga ega bo'lgan shaxsning jami buyumlari soni 15ta bo'lsa, agar qalamlar soni 3 barobar ko‘p bo‘lsa, nechta qalam bor?",
        option1: '9',
        option2: '10',
        option3: '12',
        option4: '14',
        correctOption: 3,
      },
      {
        text: 'Savol: 2, 5, 10, 17, 26... keyingi raqam nima bo‘ladi?',
        option1: '35',
        option2: '37',
        option3: '38',
        option4: '41',
        correctOption: 3,
      },
      {
        text: 'Bir hafta ichida odam har kuni 2 soat TikTokda vaqt o‘tkazadi, lekin har kuni 30 daqiqani Instagram uchun qisqartiradi. Hafta oxirida TikTok uchun jami nechta soat qoladi?',
        option1: '7',
        option2: '10',
        option3: '14',
        option4: '21',
        correctOption: 1,
      },
      {
        text: 'Savol: Bir qatorda 7 ta odam bor. Har bir odam boshqa bir odam bilan qo‘shilib so‘zlashadi. Nechta turli so‘zlashuv bo‘lishi mumkin?',
        option1: '6',
        option2: '21',
        option3: '28',
        option4: '35',
        correctOption: 2,
      },
      {
        text: ' Savol: Bir kishi 10 kg olma sotib oldi va ularni 3 kunda yedi. Birinchi kunda 3 kg olma, ikkinchi kunda 4 kg olma, uchinchi kunda esa qolgan olmaning yarmisini yedi. Necha kilogramm olma qoldi?',
        option1: '1 kg',
        option2: '2 kg',
        option3: '3 kg',
        option4: '0 kg',
        correctOption: 1,
      },
      {
        text: 'Savol: Bir oila har yilgi bayramda 50 ta shirinlik tayyorlaydi. Agar bu yil 20% ko‘proq tayyorlasa, jami qancha shirinlik tayyorlanadi?',
        option1: '60',
        option2: '55',
        option3: '70',
        option4: '65',
        correctOption: 1,
      },
      {
        text: 'Savol: 24 soat ichida nechta marta soatning katta va kichik strelkalari ustma-ust keladi?',
        option1: '22',
        option2: '23',
        option3: '24',
        option4: '12',
        correctOption: 2,
      },
      {
        text: "Ikki qavatli uyda yashayotganingizni tasavvur qiling. Uyda faqat shahar elektr tarmog'iga ulangan ikkita yoritgich va bir sham bor. Tunda ikkinchi qavatga chiqib borish uchun qaysi birini yoqasiz?",
        option1: 'Birinchi qavatdagi chiroqni',
        option2: 'Shamni',
        option3: 'Ikkinchi qavatdagi chiroqni',
        option4: 'Hammasini',
        correctOption: 2,
      },
      {
        text: "Savol: Kalendar yilida nechta oyning 28 kunidan kam bo'lmagan kuni bor?",
        option1: '1',
        option2: '12',
        option3: '11',
        option4: '6',
        correctOption: 2,
      },
      {
        text: 'Savol: Agar "like" va "share" tugmalari har bir ijtimoiy tarmoqda 2 barobar ko‘p foydalansa va odam 3 ta tarmoqda bitta postni 4 marta bosib chiqsa, jami necha marta "like" va "share" bosiladi?',
        option1: '24',
        option2: '30',
        option3: '36',
        option4: '18',
        correctOption: 3,
      },
      {
        text: "Soat uch bo'lganda devordagi soat ko'rsatkichlari nechta daraja buriladi?",
        option1: '90°',
        option2: '45°',
        option3: '180°',
        option4: '-45°',
        correctOption: 1,
      },
      {
        text: 'Otasi va o‘g‘lining umumiy yoshi 66. Otaning yoshi o‘g‘lining yoshini teskari raqamlarda ifodalaydi. Otaning yoshi nechada?',
        option1: '42',
        option2: '60',
        option3: '54',
        option4: '52',
        correctOption: 1,
      },
      {
        text: 'Bir ko‘lda nilufar guli har kuni ikki barobar ko‘payib boradi. Gullar ko‘mib ketishi uchun 48 kun kerak bo‘lsa, ko‘ldagi joyning yarmini qoplash uchun necha kun kerak bo‘ladi?',
        option1: '24 kun',
        option2: '47 kun',
        option3: '23 kun',
        option4: '25 kun',
        correctOption: 2,
      },
      {
        text: "Bir mashina 3 soatda 120 km masofa bosib o'tadi. Agar mashina tezligini ikki baravar oshirsa, 4 soatda qancha masofa bosib o'tadi?",
        option1: '240 km',
        option2: '300 km',
        option3: '180 km',
        option4: '150 km',
        correctOption: 1,
      },
      {
        text: "Agar '123' raqami '6' ga teng bo'lsa, '456' raqami nima bo'ladi?",
        option1: '12',
        option2: '9',
        option3: '15',
        option4: '18',
        correctOption: 3,
      },
      {
        text: "Agar bitta kitob 20 ming so'm bo'lsa, 3 kitobni sotib olish uchun qancha pul kerak bo'ladi?",
        option1: '50 000',
        option2: '60 000',
        option3: '55 000',
        option4: '70 000',
        correctOption: 2,
      },
      {
        text: 'Bir odamning yoshi 4 yil oldin 20 edi. Bugun uning yoshi nechta?',
        option1: '20',
        option2: '24',
        option3: '22',
        option4: '26',
        correctOption: 2,
      },
      {
        text: "Agar bir to'rtburchakning uzunligi 8 sm va kengligi 5 sm bo'lsa, uning perimetrini toping.",
        option1: '12 sm',
        option2: '26 sm',
        option3: '18 sm',
        option4: '40 sm',
        correctOption: 2,
      },
      {
        text: "Bir masofa 120 km bo'lsa va siz 60 km/soat tezlikda harakat qilsangiz, ushbu masofani nechta soatda bosib o'tasiz?",
        option1: '2',
        option2: '3',
        option3: '4',
        option4: '5',
        correctOption: 1,
      },
      {
        text: "Bir kattalik 10 ga teng. Bu kattalikning yarmi, uchdan bir qismi va to'rtning biri ni toping.",
        option1: '6, 3, 2, 5',
        option2: '5, 3.33, 2.5',
        option3: '5, 3.33, 2',
        option4: '6, 3, 2',
        correctOption: 2,
      },
    ]

    for (const questionData of questions) {
      await Question.create(questionData as any) // Using `as any` to bypass type-checking
    }

    console.log('Questions seeded successfully!')
  } catch (error) {
    console.error('Error seeding questions:', error)
  } finally {
    await sequelize.close()
  }
}

seedQuestions()
export {}
