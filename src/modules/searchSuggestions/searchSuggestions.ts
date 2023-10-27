import { ViewTemplate } from '../../utils/viewTemplate';
import { View } from '../../utils/view';
import html from './searchSuggestions.tpl.html';
import { Component } from '../component';

const suggestionsData = [
  'чехол iphone 13 pro',
  'коляски agex',
  'резина',
  'яндекс станция 2',
]

class SearchSuggestions extends Component  {
  view: View;
  
    constructor(props: any) {
      super(props);
      this.view = new ViewTemplate(html).cloneView();
    }
  
    generateSuggestions(suggestionsData: string[]) {
        const suggestionsContainer = this.view.root.querySelector('.search-suggestions__examples');
        
        if (!suggestionsContainer) {
            throw new Error("Контейнер подсказок не найден");
        }

        const createElement = (tag: string, className: string, text?: string) => {
            const elem = document.createElement(tag);
            elem.className = className;
            if (text) elem.textContent = text;
            return elem;
        };
    
        suggestionsContainer.appendChild(createElement('span', 'search-suggestions__normal-text', 'Например,'));
    
        suggestionsData.forEach((suggestion, index) => {
            const suggestionElem = createElement('div', 'search-suggestions__example');
            suggestionElem.appendChild(createElement('span', 'search-suggestions__example-text', suggestion));
            suggestionElem.addEventListener('click', () => {
              this.view.searchInput.value = suggestion
            })
            suggestionsContainer.appendChild(suggestionElem);
            
            if (index === suggestionsData.length - 1) {
            } else if (index === suggestionsData.length - 2) {
                suggestionsContainer.appendChild(createElement('span', 'search-suggestions__normal-text', 'или'));
            } else {
                suggestionsContainer.appendChild(createElement('span', 'search-suggestions__normal-text_comma', ','));
            }
        });
    
        return suggestionsContainer;
    }
  

    render() {
      this.view.root.appendChild(this.generateSuggestions(suggestionsData));
    }

    attach($root: HTMLElement) {
      $root.innerHTML = '';
      $root.appendChild(this.view.root);
    }
}

export default new SearchSuggestions(html);
