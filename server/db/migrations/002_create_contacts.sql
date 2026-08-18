-- server/db/migrations/002_create_contacts.sql
-- Run this in your Neon SQL Editor after 001_create_projects.sql
-- Creates the contacts table to store form submissions.

CREATE TABLE IF NOT EXISTS contacts (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    email      VARCHAR(100) NOT NULL,
    message    TEXT         NOT NULL,
    created_at TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
);