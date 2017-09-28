import List from '@/components/List';
import Vue from 'vue';

describe('List.vue', () => {
  it('displays items from the list', () => {
    const Constructor = Vue.extend(List);
    const ListComponent = new Constructor().$mount();

    expect(ListComponent.$el.textContent).to.contain('sleep');
    //print(ListComponent.$el.textContent);
  })
});
