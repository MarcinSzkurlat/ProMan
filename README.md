# ProMan

## Introduction
This project was completed as part of Codecool Academy. Our task was to create a "To Do" application. We decided to create a tool similar to Trello during two weekly sprints. At the end of each sprint we created a presentation and presented our application in front of the whole group.

## Task Sprints

### Sprint 1
We started our work on the project by discussing and writing down the functionality we would be able to create during the sprints, then configured the database and focused on implementing key features such as the board list overview, user support (registration, login/logout), adding boards (public/private) and the ability to move cards between columns.

### Sprint 2
The second sprint built on the progress of the first sprint, tackling tasks such as real-time collaboration, column and card management (CRUD operations), live synchronisation using Flask-SocketIO, resolving merging issues and debugging the application.

## About project
ProMan is an SPA written in Python using Flask. This project is similar to Trello, we have the possibility to add new tasks in different columns and manage them. We added live synchronisation via WebSockets and private boards.

![ProMan](https://github.com/MarcinSzkurlat/ProMan/assets/94744112/4e92218a-e849-4e40-ad8c-39d3d4bd766f)

## Getting Started

Clone this repository.
```
git clone https://github.com/MarcinSzkurlat/ProMan.git
```

Set up Python virtual environment and install required dependencies.
```
pip install -r requirements.txt
```

Configure PostgreSQL database and run application.

You should be able to browse the application by using the below URL:
```
http://localhost:5000
```
