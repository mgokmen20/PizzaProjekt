
# Nostra Pizza – Containerisiertes Bestellsystem

Ein einfaches, containerisiertes Pizza-Bestellsystem, entwickelt als 3-Tage-MVP-Projekt an der Berner Fachhochschule (BFH).


## Projektstruktur
``` text

pizza_app/
├── backend/          # Node.js Express API
├── database/         # PostgreSQL Initialisierung (init.sql)
├── frontend/         # Web-Oberfläche (Nginx, HTML5, Vanilla JS, Tailwind CSS)
├── .env.example      # Vorlage für Umgebungsvariablen
├── docker-compose.yml# Container-Orchestrierung
└── README.md

```


## Lokale Installation & Start

1. **Repository klonen:**      
    ```
    git clone <REPOSITORY_URL>
    cd pizza_app
    ```
    
2. **Umgebungsvariablen anlegen:**

    ```
    cp .env.example .env
    ```
    
3. **Container starten:**
 
    ```
    docker compose up -d --build
    ```
    
4. **Status überprüfen:**
 
    ```
    docker compose ps
    ```
    

## Zugriff auf die Dienste

- **Frontend:** [http://localhost:8080](http://localhost:8080)
    
- **Backend-API:** [http://localhost:5000](http://localhost:5000)
    
- **Datenbank:** Port `5432` (PostgreSQL)
    

## Container beenden


```
docker compose down
```

_(Hinweis: Mit `docker compose down -v` werden auch die gespeicherten Datenbank-Inhalte gelöscht)._
