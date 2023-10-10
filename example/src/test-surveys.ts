import { type Survey, SlideType } from '../../src/types';

export const SingleText: Survey = {
  id: 'single-text',
  slides: [
    {
      title: 'How was your experience?',
      subtitle: 'Please tell us more about your experience.',
      type: 'input',
      placeholder: 'Type your answer here...',
      multiline: true,
    },
  ],
  style: {
    color: 'white',
    backgroundColor: '#D9E5FF',
  },
};
