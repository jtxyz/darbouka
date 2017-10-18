import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { shallow, render } from 'enzyme';
import * as Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });


it('renders without crashing', () => {
  const wrapper = render(<App />);
  const timer = wrapper.find('section');
  expect(timer.length).toBeGreaterThan(0)
});


describe('<App />', () => {
  describe('renderButtons', () => {
    it('should render four buttons', () => {
      const app = new App();
      const buttons = app.renderButtons();
      expect(buttons.length).toBe(app.library.length);
      expect(buttons.map(b => parseInt(b.props.children[0])))
        .toEqual([5,6,10]);
    });
  });

  describe('handleClick', () => {
    describe('when it is already running', () => {
      const app = shallow(<App />);
      app.handleClick(5);
    });
  });
});