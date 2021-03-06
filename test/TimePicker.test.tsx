import { mount, shallow, ShallowWrapper, ReactWrapper } from 'enzyme';
import { mountInputSimulateChange } from './utils/TestingUtil';
import * as React from 'react';
import * as sinon from 'sinon';
import TimePicker from '../src/components/TimePicker';

describe('<TimePicker/>', () => {
  describe('shallow render test', () => {
    let shallowComponent: ShallowWrapper<React.Component>;

    beforeEach(() => {
      shallowComponent = shallow(<TimePicker />);
    });

    it('render with no props', () => {
      expect(shallowComponent).toBeTruthy();
      expect(shallowComponent).toMatchSnapshot();
    });
  });

  describe('mount test', () => {
    let onChange: sinon.SinonSpy;
    let mountComponent: ReactWrapper;
    beforeEach(() => {
      onChange = sinon.spy();
      mountComponent = mount(<TimePicker onChange={onChange} />);
    });

    it('should props onChange correctly', () => {
      mountComponent
        .find('.time-input__up button')
        .at(0)
        .simulate('click');
      expect(onChange).toHaveProperty('callCount', 1);
    });

    it('should state top, left correctly', () => {
      mountComponent.find('.timepicker__input').simulate('click');
      expect(mountComponent.state('top')).not.toEqual('');
      expect(mountComponent.state('left')).not.toEqual('');
    });

    it('should input change event correctly', () => {
      mountComponent.find('.timepicker__input input').simulate('change', {
        currentTarget: {
          value: 'test',
        },
      });
    });

    it('should input interaction correctly', () => {
      mountComponent.find('.timepicker__input').simulate('click');
      expect(mountComponent.find('.rc-backdrop')).toHaveLength(1);
      expect(mountComponent.state('timeShow')).toBeTruthy();
    });

    it('should hideCalendar correctly', () => {
      mountComponent.find('.timepicker__input').simulate('click');
      mountComponent.find('.rc-backdrop').simulate('click');
      expect(mountComponent.state('timeShow')).toBeFalsy();
    });
  });

  describe('input props', () => {
    let mountComponent: ReactWrapper;
    beforeEach(() => {
      mountComponent = mount(<TimePicker readOnly disabled clear showDefaultIcon />);
    });

    it('should props disabled not run handleTimeContainer', () => {
      mountComponent.find('.picker-input__text').simulate('click');
      expect(mountComponent.state('show')).toBeFalsy();
    });

    it('should clear button click inputValue empty', () => {
      mountComponent
        .find('.icon-clear')
        .first()
        .simulate('click');
      expect(mountComponent.state('inputValue')).toEqual('');
    });

    it('should props showDefaultIcon correctly', () => {
      expect(mountComponent.find('.icon-time').first()).toHaveLength(1);
    });
  });

  describe('handleInputBlur', () => {
    let mountComponent: ReactWrapper;
    let timepickerInput: ReactWrapper;

    beforeEach(() => {
      mountComponent = mount(<TimePicker />);
      timepickerInput = mountComponent.find('.picker-input__text');
    });

    it('should user invalid input after blur recover original', () => {
      mountComponent.setState({
        ...mountComponent.state,
        show: true,
      });

      mountInputSimulateChange(timepickerInput, '233232');
      timepickerInput.simulate('blur');

      expect(mountComponent.state('inputValue')).toEqual('01:00 AM');
    });

    it('should user valid input after blur set state inputValue', () => {
      mountComponent.setState({
        ...mountComponent.state,
        show: true,
      });

      mountInputSimulateChange(timepickerInput, '02:22 AM');
      timepickerInput.simulate('blur');
      expect(mountComponent.state('inputValue')).toEqual('02:22 AM');
    });
  });
});
