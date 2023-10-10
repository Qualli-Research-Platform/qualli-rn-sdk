export interface Survey {
  id: string;
  slides: Array<
    | InputSlide
    | SelectSlide
    | MultipleChoiceSlide
    | StarSlide
    | NumericSlide
    | NPSSlide
    | CSATSlide
  >;
  person?: Person;
  style: Style;
}

// DIFFERENT TYPES
export interface InputSlide extends Slide {
  type: SlideType.input;
  placeholder: string;
  multiline?: boolean;
}

export interface SelectSlide extends Slide {
  type: SlideType.select;
  multiple: false;
  other: boolean;
  options: string[];
}

export interface MultipleChoiceSlide extends Slide {
  type: SlideType.multiplechoice;
  multiple: true;
  other: boolean;
  options: string[];
}

export interface StarSlide extends Slide {
  type: SlideType.star;
  max: 1 | 2 | 3 | 4 | 5;
}

export interface NumericSlide extends Slide {
  type: SlideType.numeric;
  options: number[];
}

export interface NPSSlide extends Slide {
  type: SlideType.nps;
}

export interface CSATSlide extends Slide {
  type: SlideType.csat;
}

// BASE
interface Slide {
  title: string;
  subtitle?: string;
  type: SlideType;
}

interface Style {
  emojiStyle?: 'outline' | 'coloured';
  backgroundColor?: string;
  color: 'white' | 'black';
}

interface Person {
  name: string;
  role?: string;
  avatar: string;
}

export enum SlideType {
  'input' = 'input',
  'select' = 'select',
  'multiplechoice' = 'multiplechoice',
  'star' = 'star',
  'numeric' = 'numeric',
  'nps' = 'nps',
  'csat' = 'csat',
}
