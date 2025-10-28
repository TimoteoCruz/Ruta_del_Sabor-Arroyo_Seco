# Plataforma Digital de Turismo y Gastronomía - Arroyo Seco

## Descripción
Plataforma web progresiva (PWA) diseñada para que los administrativos del gobierno municipal de Arroyo Seco gestionen catálogos de ingredientes y platillos tradicionales.  
El proyecto prioriza escalabilidad, rendimiento y funcionalidad offline.

## Tecnologías
- **Frontend:** React.js + TypeScript, PWA
- **Backend:** Node.js + Express.js
- **Base de datos:** PostgreSQL
- **Control de versiones:** Git + GitHub
- **Gestión de dependencias:** NPM

## Estructura de ramas (Git Flow)
- `main` → Código en producción
- `develop` → Rama de integración
- `feature/*` → Desarrollo de nuevas funcionalidades
- `hotfix/*` → Correcciones críticas
- `release/*` → Preparación de nuevas versiones

## Workflows
- Script de K6 (k6/load-test.js): Este archivo contiene las pruebas de carga que simularán usuarios en tu app.

## k6
- Workflow de GitHub Actions (.github/workflows/k6-load-test.yml): Este archivo le dice a GitHub cuándo y cómo ejecutar las pruebas.

## Instalación (Desarrollo)
1. Clonar el repositorio:
   ```bash
   git clone https://github.com/TU_USUARIO/turismo-gastronomia-arroyo.git
