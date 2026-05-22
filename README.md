# 🏢 Escape Room — Rupture du Contrat de Travail
### Jeu pédagogique STMG Droit — Terminale

---

## 📋 Présentation

Application web interactive de type **Escape Room** destinée aux élèves de **Terminale STMG spécialité Droit**. Les joueurs incarnent des consultants RH devant résoudre 6 dossiers de rupture de contrat de travail en 40 minutes, avant l'arrivée fictive de l'inspection du travail.

**Notions juridiques couvertes :**
- Licenciement pour motif personnel / faute grave
- Procédure de licenciement (délais légaux, entretien préalable)
- Licenciement économique (étapes, reclassement)
- Calcul des indemnités légales
- Rupture conventionnelle homologuée
- Types de rupture (démission, faute grave, licenciement économique, rupture conventionnelle)

---

## 🚀 Installation et lancement

### Option 1 — Ouverture directe (recommandée pour tester)
Ouvrez le fichier `index.html` directement dans un navigateur moderne.

### Option 2 — Serveur local (recommandé pour la classe)
```bash
# Python 3
python3 -m http.server 8080

# Node.js (npx)
npx serve .

# PHP
php -S localhost:8080
```
Puis ouvrir : `http://localhost:8080`

### Option 3 — Déploiement en ligne
Déposez tous les fichiers sur n'importe quel hébergeur statique :
- GitHub Pages
- Netlify (glisser-déposer le dossier)
- Vercel

**Aucune dépendance serveur, aucune base de données.** L'application fonctionne entièrement en frontend.

---

## 📁 Structure des fichiers

```
├── index.html          # Application principale
├── css/
│   └── styles.css      # Styles (design dossier d'entreprise)
├── js/
│   ├── enigmas.js      # Données des 6 énigmes et barème
│   └── app.js          # Logique du jeu (timer, scoring, validation)
└── README.md
```

---

## 🎮 Règles du jeu

| Élément | Détail |
|---------|--------|
| Durée | 40 minutes |
| Dossiers | 6 énigmes progressives |
| Indices | 3 indices disponibles (partagés entre tous les dossiers) |
| Score max | 900 points |
| Essais | 2 à 3 par dossier selon difficulté |
| Pénalités | -15 pts par essai supplémentaire / -20 pts par indice utilisé |

**Mentions :**
- 🥇 ≥ 80% (720 pts) : Mention Très Bien
- 🥈 60-79% (540-719 pts) : Mention Bien  
- 🥉 40-59% (360-539 pts) : Mention Passable
- 📛 < 40% : Échec

---

## 📚 Les 6 Dossiers

| N° | Titre | Notion | Points |
|----|-------|--------|--------|
| 1 | L'Avertissement Oublié | Licenciement pour faute grave | 150 pts |
| 2 | Le Délai Introuvable | Procédure de licenciement | 150 pts |
| 3 | Les Étapes dans le Désordre | Licenciement économique | 200 pts |
| 4 | L'Indemnité Mystère | Calcul des indemnités | 200 pts |
| 5 | L'Accord Raté | Rupture conventionnelle | 150 pts |
| 6 | Le Cas Final | Synthèse — Types de rupture | 250 pts |

---

## 🧩 Types d'exercices

- **QCM** (dossier 1) : choix unique parmi 4 options
- **Cases à cocher** (dossier 2) : identification de plusieurs erreurs
- **Remise en ordre** (dossier 3) : glisser-déposer pour ordonner des étapes
- **Texte à compléter** (dossier 4) : calcul numérique guidé
- **Association** (dossiers 5 & 6) : relier problèmes ↔ conséquences juridiques

---

## 🖥️ Compatibilité

- ✅ Chrome, Firefox, Safari, Edge (versions récentes)
- ✅ Tablette et desktop (responsive)
- ✅ Accessibilité : contrastes WCAG AA, navigation clavier
- ✅ Chargement < 1 seconde (pas de dépendances externes)

---

## ⚙️ Personnalisation

Pour modifier une énigme, éditez le fichier `js/enigmas.js` :
- Modifier le texte du document
- Changer les options de réponse
- Ajuster le nombre d'essais (`tentativesMax`)
- Modifier les points (`points`)

Pour changer la durée : dans `js/app.js`, ligne 3 :
```js
const GAME_DURATION = 40 * 60; // modifier le 40
```
