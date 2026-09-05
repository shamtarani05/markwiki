import { Block, createBlock } from './types';

// A wiki (e.g. "Lord of the Mysteries", "Solo Leveling") is a franchise
// container with MANY pages of different kinds, not one page — confirmed
// against how real Fandom wikis are organized (Community Central's own
// Help:Categories / Help:Navigation docs: one wiki per franchise, many
// pages inside it grouped by category — Characters, Locations, Episodes,
// Weapons, Bosses, etc.). These starter templates are one per page
// *archetype*, generic across every topic category (an Anime wiki's
// Character page and a Video Game wiki's Character page start from the
// same archetype) — not one template per homepage category.

export type PageArchetype = 'overview' | 'character' | 'location' | 'episode' | 'blank';

export interface PageTemplate {
  key: PageArchetype;
  name: string;
  description: string;
  build: () => Block[];
}

export const PAGE_TEMPLATES: PageTemplate[] = [
  {
    key: 'overview',
    name: 'Overview',
    description: 'The wiki\'s main page for a series/book/game itself — synopsis, cast, themes.',
    build: () => [
      createBlock('infobox', {
        title: 'Series Title',
        image: '',
        imageCaption: '',
        fields: [
          { label: 'Author / Creator', value: '' },
          { label: 'Publisher / Studio', value: '' },
          { label: 'Genre', value: '' },
          { label: 'Status', value: '' },
          { label: 'First Released', value: '' },
        ],
      }),
      createBlock('tableOfContents', { title: 'Contents' }),
      createBlock('heading', { text: 'Synopsis', level: 2 }),
      createBlock('richText', { html: '<p>Summarize the premise here.</p>' }),
      createBlock('heading', { text: 'Characters', level: 2 }),
      createBlock('cardGrid', { title: '', columns: 3, items: [] }),
      createBlock('heading', { text: 'Themes', level: 2 }),
      createBlock('richText', { html: '<p>Notable themes and motifs.</p>' }),
      createBlock('heading', { text: 'Reception', level: 2 }),
      createBlock('richText', { html: '<p>Critical reception, awards, notable reviews.</p>' }),
      createBlock('gallery', { images: [], columns: 3 }),
    ],
  },
  {
    key: 'character',
    name: 'Character',
    description: 'A person/character page — bio infobox, abilities, relationships, trivia.',
    build: () => [
      createBlock('quote', { text: '', source: '' }),
      createBlock('infobox', {
        title: 'Character Name',
        image: '',
        imageCaption: '',
        fields: [
          { label: 'Also Known As', value: '' },
          { label: 'Species / Role', value: '' },
          { label: 'Gender', value: '' },
          { label: 'Age', value: '' },
          { label: 'Status', value: '' },
          { label: 'Affiliation', value: '' },
          { label: 'First Appearance', value: '' },
        ],
      }),
      createBlock('tableOfContents', { title: 'Contents' }),
      createBlock('heading', { text: 'Summary', level: 2 }),
      createBlock('richText', { html: '<p>Introduce the character.</p>' }),
      createBlock('heading', { text: 'Appearance', level: 2 }),
      createBlock('richText', { html: '<p>Describe their appearance.</p>' }),
      createBlock('heading', { text: 'Personality', level: 2 }),
      createBlock('richText', { html: '<p>Describe their personality.</p>' }),
      createBlock('heading', { text: 'Abilities', level: 2 }),
      createBlock('richText', { html: '<p>Describe their abilities/skills/powers.</p>' }),
      createBlock('heading', { text: 'Relationships', level: 2 }),
      createBlock('richText', { html: '<p>Describe key relationships.</p>' }),
      createBlock('heading', { text: 'Trivia', level: 2 }),
      createBlock('richText', { html: '<ul><li></li></ul>' }),
      createBlock('gallery', { images: [], columns: 3 }),
    ],
  },
  {
    key: 'location',
    name: 'Location',
    description: 'A place/setting page — region infobox, history, notable inhabitants.',
    build: () => [
      createBlock('infobox', {
        title: 'Location Name',
        image: '',
        imageCaption: '',
        fields: [
          { label: 'Type', value: '' },
          { label: 'Region', value: '' },
          { label: 'Notable Inhabitants', value: '' },
          { label: 'First Appearance', value: '' },
        ],
      }),
      createBlock('tableOfContents', { title: 'Contents' }),
      createBlock('heading', { text: 'Overview', level: 2 }),
      createBlock('richText', { html: '<p>Describe this location.</p>' }),
      createBlock('heading', { text: 'History', level: 2 }),
      createBlock('richText', { html: '<p>Notable events that happened here.</p>' }),
      createBlock('heading', { text: 'Notable Residents', level: 2 }),
      createBlock('richText', { html: '<p>Who lives or is based here.</p>' }),
      createBlock('gallery', { images: [], columns: 3 }),
    ],
  },
  {
    key: 'episode',
    name: 'Episode / Chapter',
    description: 'A single episode or chapter page — air/release info, plot, prev/next nav.',
    build: () => [
      createBlock('infobox', {
        title: 'Episode Title',
        image: '',
        imageCaption: '',
        fields: [
          { label: 'Number', value: '' },
          { label: 'Release Date', value: '' },
          { label: 'Previous', value: '' },
          { label: 'Next', value: '' },
        ],
      }),
      createBlock('heading', { text: 'Summary', level: 2 }),
      createBlock('richText', { html: '<p>Summarize what happens.</p>' }),
      createBlock('heading', { text: 'Notes', level: 2 }),
      createBlock('richText', { html: '<p>Trivia or production notes.</p>' }),
      createBlock('gallery', { images: [], columns: 3 }),
    ],
  },
  {
    key: 'blank',
    name: 'Blank',
    description: 'Start with an empty canvas and add blocks freely.',
    build: () => [],
  },
];

export function getTemplate(key: string): PageTemplate {
  return PAGE_TEMPLATES.find((t) => t.key === key) ?? PAGE_TEMPLATES[PAGE_TEMPLATES.length - 1];
}
