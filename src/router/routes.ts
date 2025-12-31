import Editor from '@/pages/Editor';
import Test from '@/pages/Test';
import EditImage from '@/pages/EditImage';
const routes = [
  {
    path: '/',
    element: Editor,
  },
  {
    path: '/test',
    element: Test,
  },
  {
    path: '/edit-image',
    element: EditImage,
  },
]
export default routes;