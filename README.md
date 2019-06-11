# CRUD Hub

CRUD (Create, Read, Update, DeletE) Hub is an online platform for sharing and discovering projects. Users can login with GitHub and submit new projects from their available GitHub repositories. Projects can be filtered by the tags which include various languages, tech stack, categories, and topics of the project.

![demo](https://giant.gfycat.com/SmugOffensiveGrizzlybear.gif)

# Built with

- React with Redux
- GitHub OAuth
- Ruby on Rails
- PostgreSQL

# Getting started

These instructions will get you a copy of the project up and running on your local machine for development.

## Prerequisites

- Ruby on Rails: https://guides.rubyonrails.org/v5.0/getting_started.html
- PostgreSQL: https://www.postgresql.org/download/
- Cloudinary: https://cloudinary.com/

## Development setup

Clone the repository to the local machine. In the root directory, the application is split into its client and server files. The server and client will both have to be running for the application to run in development.

### Server

The server will serve as the Rails API endpoint for the client application.
First, start up PostgreSQL. Then set up the database with these commands.

```sh
rails db:create
rails db:migrate
rails db:seed
```

Once the development database is set up on PostgreSQL, run this command to start the Rails server. The application will be running on `localhost:3000`.

```sh
rails s
```

### Client

Install the dependencies for the app with the following command.

```sh
yarn install
```

Then start the React app with this command. Since the Rails API is already running on `localhost:3000`, you will have to choose a different port for the client. The React app will prompt the user to switch to `localhost:3001` by default.

```sh
yarn start
```

Any `env` variables will have to be replaced with respective GitHub PATs or Cloudinary account variables.

# Usage
On the client application, the user can log in with GitHub OAuth with the login button in the nav bar at the top. The logged-in user will then be able to create a project from the nav bar.

## Creating a project

To create a project, the user will have to select from the dropdown list of the user's public repositories that they own. Selecting a repository will auto-generate the project form with the repository data from GitHub API including the project name, repo URL, the README as the project markdown, and topics and languages for tags. All of these details can be further modified for better presentation.

![create-project](https://i.imgur.com/j92caVn.png)
