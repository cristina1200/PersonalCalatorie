# 🌍 Asistent Personal de Călătorie

## 📋 Descriere Proiect

Aplicația **"Asistent Personal de Călătorie"** (Personal Travel Assistant) este o soluție web interactivă pentru planificarea, gestionarea și optimizarea experiențelor de călătorie. Proiectul academic PIU (Proiectare Interfață Utilizator) - ETAPA 7.

## 🎯 Funcionalități Principale

### 1. **Planificare Călătorie** (Planning)
- ✅ Introducere detalii destinație și date
- ✅ Validare form în timp real
- ✅ Selectare scop călătorie (recreere, serviciu, aventură, cultural)
- ✅ Definire număr de călători
- ✅ Sistem de autentificare (parolă bazată pe destinație)
- ✅ Salvare automată în localStorage

### 2. **Itinerar** (Itinerary)
- ✅ Adaugă activități cu detalii complete
- ✅ Sortare automată cronologic
- ✅ Categorii: atracție turistică, experiență autentică, masă, transport, cazare, cumpărături
- ✅ Note personale per activitate
- ✅ Durata estimată în minute
- ✅ Ștergere activități

### 3. **Hartă Interactivă** (Map)
- ✅ Vizualizare SVG a activităților pe hartă
- ✅ Markeri numerotați pentru ordine
- ✅ Timeline cronologic cu ore exacte
- ✅ Informații locație și durată per activitate
- ✅ Navegare înapoi la itinerar

### 4. **Lista de Bagaj** (Packing List)
- ✅ Generare automată pe categorii
- ✅ 6 categorii: Documente, Îmbrăcăminte, Igienă, Electronice, Accesorii, Medicamente
- ✅ Bifă articole ca „preambalate"
- ✅ Adaugă articole personalizate
- ✅ Cantitate per articol
- ✅ Ștergere articole

### 5. **Buget Călătorie** (Budget)
- ✅ Urmărire cheltuieli planificate vs. efectuate
- ✅ Categorii: cazare, transport, mâncare, activități, cumpărături
- ✅ Calcul automat total planificat/cheltuit/rămas
- ✅ Card vizual cu rezumat buget
- ✅ Adaugă cheltuieli cu status (planificată/cheltuită)
- ✅ Ștergere cheltuieli

### 6. **Experiențe Autentice** (Experiences)
- ✅ Clasificare: autentică vs. turistică
- ✅ Rating 1-5 stele
- ✅ Descrieri detaliate
- ✅ Locații și note
- ✅ Grid vizual cu carduri interactive
- ✅ Ștergere experiențe

## 🛠️ Tehnologii Utilizate

| Tehnologie | Descriere |
|-----------|-----------|
| **HTML5** | Structură semantică și forme interactive |
| **CSS3** | Styling modern cu flexbox/grid, gradient, animații |
| **JavaScript Vanilla** | Logică aplicație, validare, gestionare date |
| **localStorage** | Persistență date pe client-side |
| **SVG** | Hartă interactivă și grafică vectorială |

## 📁 Structură Fișiere

```
proiect/
├── home.html          # HTML structural (405+ linii)
├── styles.css         # Styling complet (400+ linii)
├── script.js          # JavaScript logic (700+ linii)
├── README.md          # Documentație (acest fișier)
└── ETAPA_4.txt        # Wireframe-uri (fază anterioară)
```

### Detalii Fișiere:

**home.html** - 405+ linii
- Header cu titlu și salutare personalizată
- Form planificare cu 5 câmpuri obligatorii
- 6 secțiuni principale (hidden până la login)
- Navigare tab-based pentru ușor acces
- Forme pentru fiecare funcționalitate
- Containerele pentru afișare date

**styles.css** - 400+ linii
- Reset CSS și variabile culori
- Gradient linear: #667eea → #764ba2 (tema principală)
- Flexbox/Grid layouts responsive
- Form styling cu focus states
- Card designs pentru experiențe
- Animații fade-in și hover effects
- Mobile-responsive @media queries

**script.js** - 700+ linii
- Inițializare aplicație și event listeners
- Gestionare date în obiect `appData`
- localStorage read/write
- Validare form în timp real
- Event handlers pentru 50+ acțiuni
- Funcții display pentru fiecare secțiune
- Sorting cronologic (activități)
- Calcule buget automate
- SVG drawing (hartă)

## 📊 Validare Formă

### Planificare:
- ✅ Destinație: minim 3 caractere
- ✅ Data plecare: obligatorie
- ✅ Data întoarcere: obligatorie + după plecare
- ✅ Călători: minim 1
- ✅ Scop: selectare obligatorie

### Autentificare:
- ✅ Parolă: primele 3 litere din destinație (uppercase)
- ✅ Ex: destinație "Paris" → parolă "PAR"

## 💾 Persistență Date

Aplicația salvează automat în **localStorage** cu cheie: `travelAssistantData`

Structură date:
```javascript
{
  trip: {
    destination: "Paris",
    startDate: "2024-06-01",
    endDate: "2024-06-10",
    travelers: 2,
    purpose: "vacation"
  },
  activities: [{...}],
  packingItems: [{...}],
  expenses: [{...}],
  experiences: [{...}]
}
```

Datele se incarcă automat la deschidere și se salvează la orice modificare.

## 🎨 Design System

### Culori
| Culoare | Utilizare |
|---------|-----------|
| `#667eea` | Secundă (butoane, hover, focus) |
| `#764ba2` | Accent (gradient, text important) |
| `#28a745` | Succes (buton salvare) |
| `#dc3545` | Ștergere (buton delete) |
| `#f8f9fa` | Background containers |
| `white` | Fundal principale |

### Componente
- Butoane cu shadow și transform pe hover
- Input-uri cu border pe focus
- Carduri cu animații
- Taburi de navigație active/inactive
- Mesaje eroare inline
- Slider interactiv (rating)

## 🚀 Cum Se Folosește

### 1. **Deschidere**
- Deschideți `home.html` în browser
- Apare form de planificare

### 2. **Planificare Inițială**
- Completați destinație, date, număr călători, scop
- Apăsați "Salvează Planul"
- Se cere confirmare parolă

### 3. **Logare**
- Parolă = primele 3 litere din destinație (uppercase)
- Apăsați "Conectare"

### 4. **Explorare Funcții**
- Click pe tab-uri pentru navigare
- Adaugă activități, articole bagaj, cheltuieli, experiențe
- Dați click "Hartă" pentru vizualizare cronologică

### 5. **Salvare Automată**
- Toate datele se salvează instant în localStorage
- Reîncărcați pagina - datele persistă

## 📱 Responsive Design

- ✅ **Desktop** (1200px+): 3+ coloane, layout complet
- ✅ **Tablet** (768px-1199px): 2 coloane, controale responsive
- ✅ **Mobile** (<768px): 1 coloană, navigare full-width, butoane stacked

## 🔧 Opțiuni Configurare

### Generare Automată Bagaj
Click "Generează lista automată" pentru inițierea cu 27 articole standard pe 6 categorii.

### Categorii Activități
- 🏛️ Atracție turistică
- 🌿 Experiență autentică
- 🍽️ Masă
- 🚌 Transport
- 🏨 Cazare
- 🛍️ Cumpărături

### Categorii Cheltuieli
- 🏨 Cazare
- 🚌 Transport
- 🍽️ Mâncare
- 🎭 Activități
- 🛍️ Cumpărături
- 📦 Altele

### Tipuri Experiențe
- 🌍 Autentică (locală)
- 📸 Turistică
- 🎭 Amestecată

## 📈 Statistici Aplicație

| Metrică | Valoare |
|---------|---------|
| Linii HTML | 405+ |
| Linii CSS | 400+ |
| Linii JavaScript | 700+ |
| Total cod | 1500+ |
| Culori în paletă | 6 |
| Secțiuni principale | 6 |
| Funcții JavaScript | 40+ |
| Event listeners | 50+ |

## 🎓 Cerințe PIU (ETAPA 7)

✅ **HTML5 semantic** cu forme și validare
✅ **CSS3 modern** cu layout responsive
✅ **JavaScript vanilla** (fără framework-uri)
✅ **localStorage** pentru persistență
✅ **Validare real-time** a formularelor
✅ **UX interactiv** cu feedback vizual
✅ **Hartă interactivă** (SVG)
✅ **Animații CSS** și efecte hover
✅ **Mobile-responsive** design
✅ **Parolă și logare** simplă

## 📝 Notă Funcționalitate

Aplikația funcționează **100% offline** - nu necesită server sau internet după deschidere inițială. Toate datele sunt stocate local în browser.

---

**Autor**: Student PIU  
**Instituție**: Universitatea Tehnică din Cluj-Napoca  
**Data**: ianuarie 2026  
**Status**: Complet și testat
