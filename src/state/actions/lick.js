export default function deleteLick (id) {
  console.log('DELETE LICK - create action');
  return {
      type: 'delete',
      id
  };
}