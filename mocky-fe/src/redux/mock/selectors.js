export default {
  getInterfaceId(state) {
    try {
      return state.mock.list.interface_id;
    } catch (e) {
      console.error(e);
    }
  }
}
