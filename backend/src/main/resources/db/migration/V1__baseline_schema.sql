-- Baseline schema: public content (recipient, newsletter, event) and
-- engagement submissions (contact, volunteer, newsletter subscribers).

create table recipient (
    id                 bigint generated always as identity primary key,
    public_id          text        not null unique,
    slug               text        not null unique,
    name               text        not null,
    award_year         integer     not null,
    cohort             text        not null,
    scholarship        text        not null,
    headline           text        not null,
    photo              text        not null,
    photo_alt          text        not null,
    heritage           text        not null,
    school             text        not null,
    major              text        not null,
    highlights         jsonb       not null,
    blurb              text        not null,
    story              jsonb       not null,
    quote              text        not null,
    quote_attribution  text        not null
);

create table newsletter (
    id          bigint generated always as identity primary key,
    public_id   text  not null unique,
    title       text  not null,
    issue       text  not null,
    issue_date  date  not null unique,
    headline    text  not null,
    blurb       text  not null,
    cover       text  not null,
    file        text  not null
);

create table event (
    id          bigint generated always as identity primary key,
    slug        text unique,
    title       text  not null,
    event_date  date  not null,
    time_label  text  not null,
    venue       text  not null,
    city        text  not null,
    image       text  not null,
    image_alt   text  not null
);

create table contact_submission (
    id          bigint generated always as identity primary key,
    name        text        not null,
    email       text        not null,
    phone       text        not null,
    message     text        not null,
    created_at  timestamptz not null default now()
);

create table volunteer_submission (
    id          bigint generated always as identity primary key,
    name        text        not null,
    email       text        not null,
    phone       text        not null,
    address     text,
    job         text,
    message     text        not null,
    created_at  timestamptz not null default now()
);

create table newsletter_subscriber (
    id          bigint generated always as identity primary key,
    email       text        not null unique,
    created_at  timestamptz not null default now()
);
