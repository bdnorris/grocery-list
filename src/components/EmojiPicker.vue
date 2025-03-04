<template>
  <div v-if="emoji">
    {{ emoji }}
  </div>
</template>

<script lang="ts">
import emojiData from '../assets/emoji-database.json';
import pluralToSingular from '../assets/plural-to-singular.ts';

export default {
  name: 'EmojiPicker',
  props: {
    itemName: {
      type: String,
      required: true
    }
  },
  setup (props) {
    interface Emoji {
      emoji: string,
      name: string
      group: string,
      sub_group: string,
      codepoints: string
    }
    function getEmoji () {
      const wordsInItemName = props.itemName.split(' ').map((word: string) => word.toLowerCase());
      // create an array with the original array, but also remove any plurals and add those as well
      const wordsInItemNamePluralAndSingular = [...wordsInItemName, ...wordsInItemName.map((word: string) => pluralToSingular(word))];
      console.log('wordsInItemNamePluralAndSingular:', wordsInItemNamePluralAndSingular);
      // search the emoji data for any matching characters in the wordsInItemName array
      const emojis: any = emojiData.map((item: { emoji: string, name: string }) => {
        const nameWords = item.name.split(' ');
        const match = nameWords.filter((word: string) => wordsInItemNamePluralAndSingular.includes(word));
        if (match.length > 0) {
          return item;
        }
      }).filter((item: any) => item);
      console.log('emoji:', emojis);
      if (emojis.length > 0) {
        return emojis[0].emoji;
      } else {
        return '';
      }
    }
    return {
      localName: props.itemName,
      emoji: getEmoji()
    }
  }
}
</script>
