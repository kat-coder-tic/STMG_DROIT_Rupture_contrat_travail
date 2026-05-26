# 🏢 Escape Room — Rupture du Contrat de Travail
### Jeu pédagogique STMG Droit — Terminale

---

## 📋 Présentation

Application web interactive de type **Escape Room** destinée aux élèves de **Terminale STMG spécialité Droit**. Les joueurs incarnent des consultants RH devant résoudre un premier niveau de 7 dossiers de rupture de contrat de travail en 40 minutes, avant de débloquer un second niveau de 4 missions sur les nouvelles situations de travail.

**Notions juridiques couvertes :**
- Licenciement pour motif personnel / faute grave
- Procédure de licenciement (délais légaux, entretien préalable)
- Licenciement économique (étapes, reclassement)
- Calcul des indemnités légales
- Rupture conventionnelle homologuée
- Types de rupture (démission, faute grave, licenciement économique, rupture conventionnelle)
- Départ à la retraite et rupture conventionnelle collective
- Faute lourde et intention de nuire
- Documents de fin de contrat (bulletin de salaire, certificat de travail, attestation employeur, reçu pour solde de tout compte)

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
│   ├── enigmas.js      # Données des énigmes et barème
│   └── app.js          # Logique du jeu (timer, scoring, validation)
└── README.md
```

---

## 🎮 Règles du jeu

| Élément | Détail |
|---------|--------|
| Durée | 40 minutes par niveau |
| Dossiers | Niveau 1 : 7 énigmes / Niveau 2 : 4 missions / Mission finale : 1 mot croisé |
| Indices | 3 indices disponibles (partagés entre tous les dossiers) |
| Score max | Niveau 1 : 1300 points / Niveau 2 : 740 points / Mission finale : 300 points |
| Essais | 2 à 3 par dossier selon difficulté |
| Pénalités | -15 pts par essai supplémentaire / -20 pts par indice utilisé |

**Mentions :**
- 🥇 ≥ 80% (1040 pts) : Mention Très Bien
- 🥈 60-79% (780-1039 pts) : Mention Bien  
- 🥉 40-59% (520-779 pts) : Mention Passable
- 📛 < 40% : Échec

---

## 📚 Niveau 1 — Les 7 Dossiers

| N° | Titre | Notion | Points |
|----|-------|--------|--------|
| 1 | L'Avertissement Oublié | Licenciement pour faute grave | 150 pts |
| 2 | Le Délai Introuvable | Procédure de licenciement | 150 pts |
| 3 | Les Étapes dans le Désordre | Licenciement économique | 200 pts |
| 4 | L'Indemnité Mystère | Calcul des indemnités | 200 pts |
| 5 | L'Accord Raté | Rupture conventionnelle | 150 pts |
| 6 | Le Cas Final | Synthèse — Types de rupture | 250 pts |
| 7 | La Pochette de Sortie | Retraite, faute lourde, rupture collective, documents de fin de contrat | 200 pts |

## 🔓 Niveau 2 — Les 4 Missions Débloquées

| N° | Titre | Notion | Points |
|----|-------|--------|--------|
| 1 | Le salarié fantôme | Abandon de poste / présomption de démission | 180 pts |
| 2 | Télétravail sous tension | Télétravail / droit à la déconnexion | 160 pts |
| 3 | L'apprenti disparu | Rupture du contrat d'apprentissage | 180 pts |
| 4 | L'algorithme RH | IA / libertés / droit du travail | 220 pts |

## 🧩 Mission Finale

Une fois les deux niveaux entièrement résolus, une mission finale se débloque :

| Titre | Type | Objectif | Points |
|-------|------|----------|--------|
| Le mot croisé du droit social | Mot croisé | Réviser les notions juridiques essentielles du thème | 300 pts |

Un bouton **Glossaire** est disponible en haut à droite pendant le jeu pour revoir les définitions importantes.

---

## 🧩 Types d'exercices

- **QCM** (dossier 1) : choix unique parmi 4 options
- **Cases à cocher** (dossier 2) : identification de plusieurs erreurs
- **Remise en ordre** (dossier 3) : glisser-déposer pour ordonner des étapes
- **Texte à compléter** (dossier 4) : calcul numérique guidé
- **Association** (dossiers 5, 6 & 7) : relier problèmes ↔ conséquences juridiques

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
