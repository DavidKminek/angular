# Firestore Setup - Players & Quests

## ✅ Čo je hotovo

Vaša aplikácia je teraz kompletne pripravená na prácu s Firestore databázou. Máte:

- **PlayerService** - úplne preusporiadaný na Firestore s Observable vzorcom
- **QuestsService** - už bol Firestore-ready
- **Firebase konfiguracia** v `app.config.ts` s `provideFirebaseApp` a `provideFirestore`

## 📝 Kroky na nastavenie

### 1. Aktualizujte Firebase config

V súbore [src/app/app.config.ts](src/app/app.config.ts) nahraďte placeholder údaje vašim Firebase projektom:

```typescript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

Tieto údaje nájdete v Firebase Console → Project Settings.

### 2. Vytvorte Firestore Collections

V Firebase Console vytvorte dve Collections:
- **quests** - pre otázky (mali by ste ju už mať)
- **players** - nová kolekcia pre hráčov

### 3. Inicializujte Players (voliteľne)

Ak chcete v databáze automaticky vytvoriť 3 základných hráčov, zavolajte:

```typescript
// Napríklad v app.ts alebo player.service.ts
await this.playerService.addDefaultPlayersIfEmpty();
```

## 🔄 Ako sa Players načítavajú

```
1. PlayerService.constructor() voláva loadPlayers()
2. loadPlayers() používa collectionData() z @angular/fire/firestore
3. Údaje sa aktualizujú v real-time cez Observable
4. Komponent players.ts má signal<Player[]> ktorý zobrazuje update
```

## 📌 Kľúčové zmeny

### PlayerService
- ✅ Migrácia z lokálneho signal na Firestore
- ✅ Async operácie (addPlayer, removePlayer, updateDoc)
- ✅ Real-time Observable vzorec s collectionData()
- ✅ ID typu `string` namiesto `number`

### Players komponenty
- ✅ `players.ts` - ngOnInit inicializuje z Firestore
- ✅ `players.details.ts` - akceptuje string ID namiesto number
- ✅ HTML šablóny - track p.id namiesto čísla

## 🧪 Testovanie

1. Spustite aplikáciu: `ng serve`
2. Prejdite na Players stránku
3. Vytvárte nových hráčov - mali by sa objaviť vo Firestore v reálnom čase
4. Pridávajte questu hráčom - zmeny sú trvalé v databáze
5. Otvrite Firebase Console a pozrite live aktualizácie

## 📊 Firestore dátová štruktúra

### Collection: `players`
```json
{
  "id": "firebase_generated_id",
  "nickname": "Alice",
  "xp": 150,
  "level": 2,
  "clanId": "optional_clan_id",
  "profileImage": "url_or_null",
  "activeQuests": [
    {
      "id": "quest_id",
      "title": "Find the Lost Sword",
      "description": "...",
      "xp": 40
    }
  ],
  "completedQuests": [...]
}
```

## 🔐 Firestore Security Rules

Ak používate authentication, môžete nastaviť pravidlá v Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /players/{document=**} {
      allow read, write: if request.auth != null;
    }
    match /quests/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

## ✨ Výhody tohto nastavenia

- **Real-time synchronizácia** - Firestore automaticky aktualizuje všetky klienty
- **Observable vzorec** - Kompatibilný s RxJS a Angular signálmi
- **Persistent storage** - Všetky údaje sú trvale uložené
- **Scalability** - Firestore zvláda veľké množstvo dát efektívne
- **Offline support** - Firestore offline plugin (budúcna možnosť)

## 🚀 Ďalšie kroky

1. Implementujte Firebase Authentication
2. Pridajte subscription/unsubscription pre Observables
3. Implementujte pagináciu pre veľké datasety
4. Pridajte indexy pre zložité dotazy
