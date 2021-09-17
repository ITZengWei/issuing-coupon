import {
  Button,
  Search,
  Tabs,
  Tab,
  List,
  Cell,
  ActionSheet,
  Form,
  Field,
  Divider,
  Dialog,
} from 'vant'
import 'vant/lib/index.css'

export default {
  install(Com: any) {
    Com.use(Button)
    Com.use(Search)
    Com.use(Tabs)
    Com.use(Tab)
    Com.use(List)
    Com.use(Cell)
    Com.use(ActionSheet)
    Com.use(Form)
    Com.use(Field)
    Com.use(Divider)
    Com.use(Dialog)
  },
}
