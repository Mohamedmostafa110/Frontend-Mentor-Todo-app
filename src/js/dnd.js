import Sortable from 'sortablejs';
import { reorderVisible } from './store.js';

export function initDragAndDrop(listEl) {
  return Sortable.create(listEl, {
    draggable: '.todo:not(.todo--empty)',
    animation: 180,
    ghostClass: 'is-ghost',
    chosenClass: 'is-chosen',
    dragClass: 'is-dragging',
    delay: 150,
    delayOnTouchOnly: true,
    touchStartThreshold: 4,
    filter: '.todo__delete',
    preventOnFilter: false,
    onEnd(evt) {
      if (evt.oldIndex === evt.newIndex) return;
      const ids = [...listEl.querySelectorAll('.todo')].map((li) => li.dataset.id);
      reorderVisible(ids);
    },
  });
}
