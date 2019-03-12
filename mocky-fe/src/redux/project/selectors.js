export default {
  getDetailId: state => {
    try {
      return state.project.detail.id;
    } catch (e) {
      console.error(e);
    }
  },
};
