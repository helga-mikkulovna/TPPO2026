import { getLecturerLessons } from '../api/timetable';

/**
 * @typedef {{
 *   data: any,
 *   loading: boolean,
 *   error: string | null,
 *   requestKey: string | null,
 * }} StoreState
 */

/** @type {StoreState} */
let state = {
  data: null,
  loading: false,
  error: null,
  requestKey: null,
};

/** @type {Set<() => void>} */
const listeners = new Set();

/** @type {AbortController | null} */
let inFlightController = null;

function emitChange() {
  for (const l of listeners) l();
}

function setState(partial) {
  state = { ...state, ...partial };
  emitChange();
}

export const lecturerTimetableStore = {
  /** @param {() => void} listener */
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getSnapshot() {
    return state;
  },

  abort() {
    if (inFlightController) {
      inFlightController.abort();
      inFlightController = null;
    }
  },

  /**
   * @param {object} query
   * @param {string} query.first_name
   * @param {string} query.second_name
   * @param {string} query.middle_name
   * @param {string} query.start_date
   * @param {string} query.end_date
   */
  async load(query) {
    const requestKey = JSON.stringify(query);
    if (state.requestKey === requestKey && (state.loading || state.data)) {
      return;
    }

    this.abort();
    const controller = new AbortController();
    inFlightController = controller;

    setState({ loading: true, error: null, requestKey });

    try {
      const data = await getLecturerLessons(query, { signal: controller.signal });
      if (controller.signal.aborted) return;
      setState({ data, loading: false, error: null });
    } catch (e) {
      if (controller.signal.aborted) return;
      setState({ data: null, loading: false, error: e?.message || 'Не удалось загрузить расписание' });
    } finally {
      if (inFlightController === controller) {
        inFlightController = null;
      }
    }
  },
};
