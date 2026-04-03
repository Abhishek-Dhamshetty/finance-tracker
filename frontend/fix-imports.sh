#!/bin/bash

# Fix App.tsx - remove unused React import
sed -i '' "s/import React from 'react';//g" src/App.tsx

# Fix type imports across all files
find src -name "*.tsx" -o -name "*.ts" | while read file; do
  # Fix ButtonHTMLAttributes
  sed -i '' 's/import React, { ButtonHTMLAttributes }/import React, { type ButtonHTMLAttributes }/g' "$file"
  
  # Fix InputHTMLAttributes
  sed -i '' 's/import React, { InputHTMLAttributes }/import React, { type InputHTMLAttributes }/g' "$file"
  
  # Fix SelectHTMLAttributes
  sed -i '' 's/import React, { SelectHTMLAttributes }/import React, { type SelectHTMLAttributes }/g' "$file"
  
  # Fix ReactNode
  sed -i '' 's/import React, { createContext, useContext, useReducer, useEffect, ReactNode }/import React, { createContext, useContext, useReducer, useEffect, type ReactNode }/g' "$file"
  
  # Fix type imports from types/index
  sed -i '' "s/import { \([^}]*\) } from '..\/types'/import type { \1 } from '..\/types'/g" "$file"
  sed -i '' "s/import { \([^}]*\) } from '\.\.\/\.\.\/types'/import type { \1 } from '\.\.\/\.\.\/types'/g" "$file"
  
  # Remove unused imports
  sed -i '' 's/TrendingDown, //g' "$file"
  sed -i '' 's/Target, //g' "$file"
  sed -i '' 's/TrendingUp, //g' "$file"
  sed -i '' 's/Legend, //g' "$file"
done
