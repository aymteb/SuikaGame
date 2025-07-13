# 🍎 Suika Game

Un jeu de puzzle addictif inspiré du célèbre Suika Game, développé en React TypeScript avec Matter.js pour la physique.

## 🎮 À propos du jeu

Suika Game est un jeu de puzzle où vous devez faire tomber des fruits dans un récipient. Quand deux fruits identiques se touchent, ils fusionnent pour créer un fruit plus gros. L'objectif est d'obtenir le fruit le plus gros possible (la pastèque) sans que les fruits atteignent le haut de l'écran.

## 🚀 Installation et lancement

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn

### Installation des dépendances
```bash
# Naviguez vers le dossier du projet
cd SuikaGame

# Installez les dépendances
npm install
```

### Lancement du jeu
```bash
# Lancez le serveur de développement
npm run dev
```

Le jeu sera accessible à l'adresse `http://localhost:5173` (ou l'URL affichée dans le terminal).

## 🎯 Contrôles

- **Flèches gauche/droite** : Déplacer le fruit actuel horizontalement
- **Touche Espace** : Lâcher le fruit dans le récipient

## 🍓 Système de fusion des fruits

Les fruits fusionnent par ordre de taille croissante :
1. **Cerise** (5 points)
2. **Fraise** (10 points)
3. **Raisin** (15 points)
4. **Kumquat** (20 points)
5. **Orange** (25 points)
6. **Pomme** (30 points)
7. **Poire** (35 points)
8. **Pêche** (40 points)
9. **Ananas** (45 points)
10. **Melon** (50 points)
11. **Pastèque** (100 points) - Fruit final !

## 🎯 Objectif

- Faites fusionner les fruits pour obtenir des fruits plus gros
- Évitez que les fruits atteignent la ligne rouge en haut
- Essayez d'obtenir la pastèque pour un maximum de points !

## 🛠️ Technologies utilisées

- **React 19** - Framework frontend
- **TypeScript** - Typage statique
- **Matter.js** - Moteur physique 2D
- **Vite** - Outil de build et serveur de développement

## 📁 Structure du projet

```
SuikaGame/
├── src/
│   ├── App.tsx          # Composant principal du jeu
│   ├── Fruits.tsx       # Configuration des fruits
│   ├── AddCurentFruit.tsx # Logique d'ajout de fruits
│   └── main.tsx         # Point d'entrée
├── public/Images/       # Images des fruits
└── package.json         # Dépendances et scripts
```

## 🎮 Bon jeu !

Amusez-vous bien avec ce Suika Game ! Essayez d'obtenir le meilleur score possible en créant la plus grosse pastèque ! 🍉

