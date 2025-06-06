# Lizmap Rails Port (WIP)

This directory contains an initial skeleton for porting the Lizmap Web Client from Jelix/PHP to Ruby on Rails. It demonstrates how Lizmap data models can be represented in Rails using Active Record.

The included example mirrors the `user` DAO from the Jelix application.

## Setup

Install dependencies and run database migrations:

```bash
bundle install
rails db:migrate
```

## Caveats

This is only a starting point. Porting the full application requires translating controllers, views, and the remaining business logic.
