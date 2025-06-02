/* eslint-disable react-hooks/rules-of-hooks */
import { defaultProps, insertOrUpdateBlock } from '@blocknote/core';
import { BlockTypeSelectItem, createReactBlockSpec } from '@blocknote/react';
import { TFunction } from 'i18next';
import React, { useEffect, useState } from 'react';
import { css } from 'styled-components';

import { Box, BoxButton, Icon } from '@/components';

import { DocsBlockNoteEditor } from '../../types';
import { EmojiPicker } from '../EmojiPicker';

const databaseCustom = [
  {
    name: 'Databas',
    id: 'database',
    emojis: [
      'bulb',
      'point_right',
      'point_up',
      'ok_hand',
      'key',
      'construction',
      'warning',
      'fire',
      'pushpin',
      'scissors',
      'question',
      'no_entry',
      'no_entry_sign',
      'alarm_clock',
      'phone',
      'rotating_light',
      'recycle',
      'white_check_mark',
      'lock',
      'paperclip',
      'book',
      'speaking_head_in_silhouette',
      'arrow_right',
      'loudspeaker',
      'hammer_and_wrench',
      'gear',
    ],
  },
];

const databaseCategories = [
  'database',
  'people',
  'nature',
  'foods',
  'activity',
  'places',
  'flags',
  'objects',
  'symbols',
];

export const DatabaseBlock = createReactBlockSpec(
  {
    type: 'database',
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      backgroundColor: defaultProps.backgroundColor,
      emoji: { default: '💡' },
    },
    content: 'inline',
  },
  {
    render: ({ block, editor, contentRef }) => {
      const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

      const toggleEmojiPicker = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setOpenEmojiPicker(!openEmojiPicker);
      };

      const onClickOutside = () => setOpenEmojiPicker(false);

      const onEmojiSelect = ({ native }: { native: string }) => {
        editor.updateBlock(block, { props: { emoji: native } });
        setOpenEmojiPicker(false);
      };

      // Temporary: sets a yellow background color to a database block when added by
      // the user, while keeping the colors menu on the drag handler usable for
      // this custom block.
      useEffect(() => {
        if (
          !block.content.length &&
          block.props.backgroundColor === 'default'
        ) {
          editor.updateBlock(block, { props: { backgroundColor: 'yellow' } });
        }
      }, [block, editor]);

      return (
        <Box
          $padding="1rem"
          $gap="0.625rem"
          style={{
            flexGrow: 1,
            flexDirection: 'row',
          }}
        >
          <BoxButton
            contentEditable={false}
            onClick={toggleEmojiPicker}
            $css={css`
              font-size: 1.125rem;
              &:hover {
                background-color: rgba(0, 0, 0, 0.1);
              }
            `}
            $align="center"
            $height="28px"
            $width="28px"
            $radius="4px"
          >
            {block.props.emoji}
          </BoxButton>

          {openEmojiPicker && (
            <EmojiPicker
              categories={databaseCategories}
              custom={databaseCustom}
              onClickOutside={onClickOutside}
              onEmojiSelect={onEmojiSelect}
            />
          )}
          <Box as="p" className="inline-content" ref={contentRef} />
        </Box>
      );
    },
  },
);

export const getDatabaseReactSlashMenuItems = (
  editor: DocsBlockNoteEditor,
  t: TFunction<'translation', undefined>,
  group: string,
) => [
  {
    title: t('Database'),
    onItemClick: () => {
      insertOrUpdateBlock(editor, {
        type: 'database',
      });
    },
    aliases: ['database', 'encadré', 'hervorhebung', 'benadrukken'],
    group,
    icon: <Icon iconName="lightbulb" $size="18px" />,
    subtext: t('Add a database block'),
  },
];

export const getDatabaseFormattingToolbarItems = (
  t: TFunction<'translation', undefined>,
): BlockTypeSelectItem => ({
  name: t('Database'),
  type: 'database',
  icon: () => <Icon iconName="lightbulb" $size="16px" />,
  isSelected: (block) => block.type === 'database',
});
