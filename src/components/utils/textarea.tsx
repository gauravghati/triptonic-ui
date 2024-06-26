import { COLORS } from 'assets/constants';
import React from 'react';
import { TextInput } from 'react-native';

interface ITextareaProps {
  text: string;
  onChangeText: any;
  placeholder: string;
}

const Textarea: React.FC<ITextareaProps> = ({ text, onChangeText, placeholder }) => {
  return (
    <TextInput
      placeholder={placeholder}
      multiline={true}
      onChangeText={onChangeText}
      style={{ height: '85%', textAlignVertical: 'top', color: COLORS['dark-text'] }}
      className='font-rethink text-xl'
      selectionColor={COLORS['sageish']}
      value={text}/>
  );
}

export default Textarea;
