CREATE DATABASE strings;

CREATE TABLE users(
    user_id SERIAL PRIMARY KEY,
    username varchar(32) NOT NULL UNIQUE,
    email_id varchar(64) NOT NULL,
    pass_hash VARCHAR(255) NOT NULL,
    is_adm BOOLEAN NOT NULL,
    UNIQUE (email_id, username)
);

CREATE TABLE content (
    user_id INT NOT NULL,
    content_id BIGSERIAL PRIMARY KEY NOT NULL,
    title varchar(125) NOT NULL,
    img varchar(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE actions (
    user_id INT NOT NULL,
    content_id INT NOT NULL,
    _like BOOLEAN,
    _dislike BOOLEAN,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (content_id) REFERENCES content(content_id) ON DELETE CASCADE
);
