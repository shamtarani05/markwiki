import { Node, mergeAttributes } from '@tiptap/core';

// A minimal custom block node so video URLs can live inline in the flowing
// document, the same way @tiptap/extension-image handles images — no
// official TipTap video extension exists, so this is hand-rolled but small:
// one attribute (src), rendered as a wrapped iframe.
declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    videoEmbed: {
      setVideoEmbed: (options: { src: string }) => ReturnType;
    };
  }
}

export const VideoEmbed = Node.create({
  name: 'videoEmbed',
  group: 'block',
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      src: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-video-embed]' }];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'div',
      mergeAttributes(HTMLAttributes, { 'data-video-embed': '', class: 'tiptap-video-embed' }),
      ['iframe', { src: node.attrs.src, frameborder: '0', allowfullscreen: 'true' }],
    ];
  },

  addCommands() {
    return {
      setVideoEmbed: (options: { src: string }) => ({ commands }) =>
        commands.insertContent({ type: this.name, attrs: options }),
    };
  },
});
