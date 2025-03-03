<template>
  <div v-if="emoji">
    {{ emoji.emoji }}
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
    function getEmoji (name: string) {
      const wordsInItemName = props.itemName.split(' ').map((word: string) => word.toLowerCase());
      // create an array with the original array, but also remove any plurals and add those as well
      const wordsInItemNamePluralAndSingular = [...wordsInItemName, ...wordsInItemName.map((word: string) => pluralToSingular(word))];
      console.log('wordsInItemNamePluralAndSingular:', wordsInItemNamePluralAndSingular);
      // search the emoji data for any matching characters in the wordsInItemName array
      const emojis = emojiData.map((item: { emoji: string, name: string }) => {
        const nameWords = item.name.split(' ');
        const match = nameWords.filter((word: string) => wordsInItemNamePluralAndSingular.includes(word));
        if (match.length > 0) {
          return item;
        }
      }).filter((item: any) => item);
      console.log('emoji:', emojis);
      return emojis ? emojis[0] : false;
    }
    return {
      localName: props.itemName,
      emoji: getEmoji(props.itemName)
    }
  }
}
</script>
