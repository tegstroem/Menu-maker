Project 2: React App for COURSE 5 - REACT & JAVASCRIPT
Individual project.

# Menu Maker 

A React-based web application that helps users create, manage, and organize weekly meal menus with recipe inspiration.

## Overview

Menu Maker allows users to build personalized weekly menus by creating recipes, dragging them into a weekly planner, and saving their favorite menu combinations. Get recipe inspiration from an external API and save recipes for future use.

## Key Features

- **Recipe Management** - Create, edit, and delete custom recipes
- **Weekly Menu Planner** - Drag-and-drop recipes into a 7-day menu board
- **Recipe Inspiration** - Search and browse recipes from TheMealDB API
- **Save Menus** - Save complete weekly menus for future reference
- **Persistent Storage** - All data saved to localStorage
- **Responsive Design** - Clean, user-friendly interface with custom styling

## Project Structure

```
src/
├── components/
│   ├── MenuBoard.jsx          # Weekly menu display with drag-and-drop
│   ├── RecipeForm.jsx         # Form to create/edit recipes
│   ├── RecipeSelect.jsx       # Select recipes from API
│   └── SavedMenus.jsx         # View and manage saved menus
├── pages/
│   ├── InspirationPage.jsx    # Browse recipes from API
│   ├── MenusPage.jsx          # Saved menus collection
│   └── RecipesPage.jsx        # Saved recipes collection
├── files/                      # Images and assets
└── App.jsx                     # Main app component
```

## How to Use

1. **Create or find Recipes** - Fill out the recipe form with title, description, and ingredients or search the library of recipes to add to the menu.
2. **Create Menu** - Drag recipes from the list to specific days in the menu board and save!
3. **Get Inspiration** - Search for recipes on the Inspiration page and add them to your collection
4. **Saved Menus** - Save your complete weekly menu for future reference
5. **Manage** - Edit or delete recipes as needed

## Tech Stack

- **React** - UI library
- **React Router** - Navigation
- **React Beautiful DnD** - Drag-and-drop functionality
- **TheMealDB API** - Recipe data
- **CSS Modules** - Styling
- **localStorage** - Data
