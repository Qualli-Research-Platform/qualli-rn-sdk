import { View, Text } from 'react-native';
import type {
  InputSlide,
  SelectSlide,
  MultipleChoiceSlide,
  StarSlide,
  NumericSlide,
  NPSSlide,
  CSATSlide,
} from '../../../types';
import styles from './../../survey.style';
import { type } from '../../../types';

interface Props {
  slide:
    | InputSlide
    | SelectSlide
    | MultipleChoiceSlide
    | StarSlide
    | NumericSlide
    | NPSSlide
    | CSATSlide;
}

const SurveySlide = (props: Props) => {
  const slide = props.slide;

  if (!slide) return null;

  const { title, subtitle, type } = slide;

  return (
    <View>
      <Text style={styles.base.title}>{title}</Text>

      {subtitle && <Text style={styles.base.subtitle}>{subtitle}</Text>}
    </View>
  );
};

export default SurveySlide;
