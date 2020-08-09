import { Component, OnInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { SupervisorService } from '../service/supervisor.service';
declare var $: any;

interface TeamNode {
  firstName: string;
  reporters?: TeamNode[];
}
@Component({
  selector: 'app-supervisor-dashboard',
  templateUrl: './supervisor-dashboard.component.html',
  styleUrls: ['./supervisor-dashboard.component.css']
})
export class SupervisorDashboardComponent implements OnInit {
  TREE_DATA = [];

  treeControl = new NestedTreeControl<TeamNode>(node => node.reporters);
  dataSource = new MatTreeNestedDataSource<TeamNode>();
  rolelist: any[];
  roleUserID: any;
  reporterUserID: any;
  changebutton: boolean = false;
  repBttnId: any = true;
  activeNode: any;
  constructor(private supervisorService: SupervisorService) {}

  ngOnInit() {
    this.getTeamList(); //supervisorRelated
    // this.checkJson()
  }
  checkJson() {
    var sit = "{\"userID\":611,\"branchID\":1132,\"firstName\":\"Ramakrishna\",\"lastName\":\"M\",\"supervisorUserID\":1661,\"email\":\"e00611@esfbuat.in\",\"CBSUserID\":\"611testingsample1234\",\"role\":[{\"roleID\":\"204\",\"name\":\"User Checker\"},{\"roleID\":\"205\",\"name\":\"Master Checker\"},{\"roleID\":\"15\",\"name\":\"D1 User\"},{\"roleID\":\"17\",\"name\":\"Customer Modification Maker\"},{\"roleID\":\"18\",\"name\":\"Account Modification Maker\"},{\"roleID\":\"21\",\"name\":\"SR Creator\"},{\"roleID\":\"105\",\"name\":\"Group Modification Maker\"},{\"roleID\":\"107\",\"name\":\"Data Viewer\"},{\"roleID\":\"111\",\"name\":\"Branch Maker\"},{\"roleID\":\"201\",\"name\":\"TAB DVU\"}],\"reporters\":[{\"userID\":666,\"branchID\":1087,\"firstName\":\"seema\",\"lastName\":\"sri\",\"supervisorUserID\":611,\"email\":\"e000123@esfbuat.in\",\"CBSUserID\":\"666sample123\",\"role\":[{\"roleID\":\"15\",\"name\":\"D1 User\"},{\"roleID\":\"17\",\"name\":\"Customer Modification Maker\"},{\"roleID\":\"18\",\"name\":\"Account Modification Maker\"},{\"roleID\":\"21\",\"name\":\"SR Creator\"}],\"reporters\":[]},{\"userID\":1002,\"branchID\":1021,\"firstName\":\"Vivek\",\"lastName\":\"V\",\"supervisorUserID\":611,\"email\":\"vivekv@equitasbank.com\",\"CBSUserID\":\"1002\",\"role\":[{\"roleID\":\"6\",\"name\":\"Branch Operations Manager\"}],\"reporters\":[{\"userID\":1000,\"branchID\":9999,\"firstName\":\"Ganesh \",\"lastName\":\"N\",\"supervisorUserID\":1002,\"email\":\"ganeshn@equitasbank.com\",\"CBSUserID\":\"1000\",\"role\":[{\"roleID\":\"3\",\"name\":\"Regional Head\"}],\"reporters\":[{\"userID\":23,\"branchID\":1001,\"firstName\":\"asd\",\"lastName\":\"asd\",\"supervisorUserID\":1000,\"email\":\"232\",\"CBSUserID\":\"1\",\"role\":[{\"roleID\":\"8\",\"name\":\"Relationship Manager\"}],\"reporters\":[{\"userID\":15896,\"branchID\":1003,\"firstName\":\"Rpa\",\"lastName\":\"Test\",\"supervisorUserID\":23,\"email\":\"e15896@equitas.in\",\"CBSUserID\":\"15896\",\"role\":[{\"roleID\":\"6\",\"name\":\"Branch Operations Manager\"}],\"reporters\":[]},{\"userID\":15897,\"branchID\":1003,\"firstName\":\"Rpa\",\"lastName\":\"Test\",\"supervisorUserID\":23,\"email\":\"e15897@equitas.in\",\"CBSUserID\":\"15897\",\"role\":[{\"roleID\":\"6\",\"name\":\"Branch Operations Manager\"}],\"reporters\":[]},{\"userID\":29878,\"branchID\":992,\"firstName\":\"test\",\"lastName\":\"case\",\"supervisorUserID\":23,\"email\":\"29878@esfbuat.in\",\"CBSUserID\":\"29878\",\"role\":[{\"roleID\":\"7\",\"name\":\"D0 User\"}],\"reporters\":[]},{\"userID\":7890001,\"branchID\":992,\"firstName\":\"testing\",\"lastName\":\"case\",\"supervisorUserID\":23,\"email\":\"789000@esfbuat.in\",\"CBSUserID\":\"789000\",\"role\":[{\"roleID\":\"15\",\"name\":\"D1 User\"},{\"roleID\":\"12\",\"name\":\"QC\"},{\"roleID\":\"16\",\"name\":\"D2 User\"},{\"roleID\":\"14\",\"name\":\"DVU\"},{\"roleID\":\"7\",\"name\":\"D0 User\"}],\"reporters\":[]},{\"userID\":99886655,\"branchID\":1003,\"firstName\":\"tetss\",\"lastName\":\"asds\",\"supervisorUserID\":23,\"email\":\"E99886655@esfbuat.in\",\"CBSUserID\":\"99886655\",\"role\":[{\"roleID\":\"9\",\"name\":\"Branch Business Correspondent Manager\"}],\"reporters\":[]},{\"userID\":777777777,\"branchID\":9025,\"firstName\":\"fdfff\",\"lastName\":\"ffff\",\"supervisorUserID\":23,\"email\":\"77777777777@esfbuat.in\",\"CBSUserID\":\"777777777\",\"role\":[{\"roleID\":\"7\",\"name\":\"D0 User\"}],\"reporters\":[]}]},{\"userID\":45451,\"branchID\":1001,\"firstName\":\"asd1\",\"lastName\":\"asd1\",\"supervisorUserID\":1000,\"email\":\"2321\",\"CBSUserID\":\"11\",\"role\":[{\"roleID\":\"8\",\"name\":\"Relationship Manager\"}],\"reporters\":[]},{\"userID\":1111111,\"branchID\":1001,\"firstName\":\"asd111\",\"lastName\":\"asd111\",\"supervisorUserID\":1000,\"email\":\"23211\",\"CBSUserID\":\"111\",\"role\":[{\"roleID\":\"8\",\"name\":\"Relationship Manager\"}],\"reporters\":[]}]},{\"userID\":2331231,\"branchID\":1002,\"firstName\":\"test\",\"lastName\":\"estsdfsdf\",\"supervisorUserID\":1002,\"email\":\"erroruser@esfbuat.in\",\"CBSUserID\":\"9879879\",\"role\":[{\"roleID\":\"12\",\"name\":\"QC\"}],\"reporters\":[]},{\"userID\":13051305,\"branchID\":1005,\"firstName\":\"testing\",\"lastName\":\"test\",\"supervisorUserID\":1002,\"email\":\"13051305@esfbuat.in\",\"CBSUserID\":\"13051305kijlunnnjkgh\",\"role\":[{\"roleID\":\"7\",\"name\":\"D0 User\"},{\"roleID\":\"12\",\"name\":\"QC\"}],\"reporters\":[]}]},{\"userID\":1005,\"branchID\":1006,\"firstName\":\"Pwag\",\"lastName\":\"H\",\"supervisorUserID\":611,\"email\":\"pwagh@euronetworldwide.com\",\"CBSUserID\":\"1005\",\"role\":[{\"roleID\":\"3\",\"name\":\"Regional Head\"}],\"reporters\":[]},{\"userID\":1007,\"branchID\":1021,\"firstName\":\"Shreedharan\",\"lastName\":\"KJ\",\"supervisorUserID\":611,\"email\":\"shreedharankj@equitasbank.com\",\"CBSUserID\":\"1007\",\"role\":[{\"roleID\":\"3\",\"name\":\"Regional Head\"}],\"reporters\":[]},{\"userID\":1008,\"branchID\":1021,\"firstName\":\"Prasanna\",\"lastName\":\"Atm\",\"supervisorUserID\":611,\"email\":\"prasannaatm@equitasbank.com\",\"CBSUserID\":\"1008\",\"role\":[{\"roleID\":\"3\",\"name\":\"Regional Head\"}],\"reporters\":[]},{\"userID\":1767,\"branchID\":1002,\"firstName\":\"ANANDAKUMAR\",\"lastName\":\"SUNDARAM\",\"supervisorUserID\":611,\"email\":\"e01767\",\"CBSUserID\":\"1767\",\"role\":[{\"roleID\":\"15\",\"name\":\"D1 User\"},{\"roleID\":\"16\",\"name\":\"D2 User\"},{\"roleID\":\"12\",\"name\":\"QC\"},{\"roleID\":\"17\",\"name\":\"Customer Modification Maker\"},{\"roleID\":\"19\",\"name\":\"Customer Modification Checker\"},{\"roleID\":\"21\",\"name\":\"SR Creator\"},{\"roleID\":\"7\",\"name\":\"D0 User\"}],\"reporters\":[]},{\"userID\":1768,\"branchID\":1002,\"firstName\":\"ANANDAKUMAR \",\"lastName\":\"SUNDARAM\",\"supervisorUserID\":611,\"email\":\"e01768@esfbuat.in\",\"CBSUserID\":\"1768\",\"role\":[{\"roleID\":\"17\",\"name\":\"Customer Modification Maker\"},{\"roleID\":\"19\",\"name\":\"Customer Modification Checker\"},{\"roleID\":\"21\",\"name\":\"SR Creator\"},{\"roleID\":\"7\",\"name\":\"D0 User\"},{\"roleID\":\"12\",\"name\":\"QC\"},{\"roleID\":\"15\",\"name\":\"D1 User\"},{\"roleID\":\"16\",\"name\":\"D2 User\"}],\"reporters\":[]},{\"userID\":12346,\"branchID\":1001,\"firstName\":\"Test\",\"lastName\":\"Test\",\"supervisorUserID\":611,\"email\":\"e12346@equitas.in\",\"CBSUserID\":\"12346\",\"role\":[{\"roleID\":\"7\",\"name\":\"D0 User\"}],\"reporters\":[]},{\"userID\":15796,\"branchID\":1026,\"firstName\":\"Test\",\"lastName\":\" Name\",\"supervisorUserID\":611,\"email\":\"e15796@equitas.in\",\"CBSUserID\":\"15796\",\"role\":[{\"roleID\":\"1\",\"name\":\"Consumer Banking Head\"}],\"reporters\":[]},{\"userID\":29033,\"branchID\":1001,\"firstName\":\"Tushar Gordhanbhai\",\"lastName\":\"Patel\",\"supervisorUserID\":611,\"email\":\"e29033@esfbuat.in\",\"CBSUserID\":\"29033\",\"role\":[{\"roleID\":\"14\",\"name\":\"DVU\"}],\"reporters\":[]},{\"userID\":29061,\"branchID\":1,\"firstName\":\"Shekhar\",\"lastName\":\"Patil\",\"supervisorUserID\":611,\"email\":\"e29061@esfbuat.in\",\"CBSUserID\":\"29061\",\"role\":[{\"roleID\":\"15\",\"name\":\"D1 User\"}],\"reporters\":[]},{\"userID\":29063,\"branchID\":9999,\"firstName\":\"Vishal\",\"lastName\":\"Chavan\",\"supervisorUserID\":611,\"email\":\"e29063@esfbuat.in\",\"CBSUserID\":\"29063\",\"role\":[{\"roleID\":\"15\",\"name\":\"D1 User\"}],\"reporters\":[]},{\"userID\":29070,\"branchID\":1,\"firstName\":\"Deepak\",\"lastName\":\"Saini\",\"supervisorUserID\":611,\"email\":\"e29070@esfbuat.in@esfbuat.in\",\"CBSUserID\":\"29070\",\"role\":[{\"roleID\":\"15\",\"name\":\"D1 User\"}],\"reporters\":[]},{\"userID\":29071,\"branchID\":1,\"firstName\":\"Rakesh\",\"lastName\":\"Gour\",\"supervisorUserID\":611,\"email\":\"e29071@esfbuat.in@esfbuat.in\",\"CBSUserID\":\"29071\",\"role\":[{\"roleID\":\"15\",\"name\":\"D1 User\"}],\"reporters\":[]},{\"userID\":29073,\"branchID\":1,\"firstName\":\"Mahesh\",\"lastName\":\"Navi\",\"supervisorUserID\":611,\"email\":\"29073@esfbuat.in\",\"CBSUserID\":\"29073\",\"role\":[{\"roleID\":\"15\",\"name\":\"D1 User\"}],\"reporters\":[]},{\"userID\":29097,\"branchID\":1002,\"firstName\":\"Dinesh Subramaniyam\",\"lastName\":\"Subramaniyam\",\"supervisorUserID\":611,\"email\":\"e29097@esfbuat.in\",\"CBSUserID\":\"29097\",\"role\":[{\"roleID\":\"7\",\"name\":\"D0 User\"}],\"reporters\":[]},{\"userID\":34177,\"branchID\":9999,\"firstName\":\"Bala\",\"lastName\":\"Sekar\",\"supervisorUserID\":611,\"email\":\"e34177\",\"CBSUserID\":\"34177\",\"role\":[{\"roleID\":\"201\",\"name\":\"TAB DVU\"}],\"reporters\":[]},{\"userID\":34178,\"branchID\":9999,\"firstName\":\"Bala\",\"lastName\":\"Sekar 2\",\"supervisorUserID\":611,\"email\":\"e34178\",\"CBSUserID\":\"34178\",\"role\":[{\"roleID\":\"201\",\"name\":\"TAB DVU\"}],\"reporters\":[]},{\"userID\":34179,\"branchID\":9999,\"firstName\":\"Bala\",\"lastName\":\"Sekar\",\"supervisorUserID\":611,\"email\":\"e34179@esfbuat.in\",\"CBSUserID\":\"34179\",\"role\":[{\"roleID\":\"201\",\"name\":\"TAB DVU\"}],\"reporters\":[]},{\"userID\":34180,\"branchID\":9999,\"firstName\":\"Bala\",\"lastName\":\"Sekar 2\",\"supervisorUserID\":611,\"email\":\"e34180@esfbuat.in\",\"CBSUserID\":\"34180\",\"role\":[{\"roleID\":\"201\",\"name\":\"TAB DVU\"}],\"reporters\":[]},{\"userID\":39201,\"branchID\":9999,\"firstName\":\"Royal\",\"lastName\":\"Anil\",\"supervisorUserID\":611,\"email\":\"e39201@equitas.in\",\"CBSUserID\":\"39201\",\"role\":[{\"roleID\":\"21\",\"name\":\"SR Creator\"}],\"reporters\":[]},{\"userID\":39203,\"branchID\":9999,\"firstName\":\"Royal\",\"lastName\":\"Anil\",\"supervisorUserID\":611,\"email\":\"e39203@equitas.in\",\"CBSUserID\":\"39203\",\"role\":[{\"roleID\":\"21\",\"name\":\"SR Creator\"}],\"reporters\":[]},{\"userID\":40628,\"branchID\":9999,\"firstName\":\"Bala\",\"lastName\":\"Sekar\",\"supervisorUserID\":611,\"email\":\"e40628@equitas.in\",\"CBSUserID\":\"40628\",\"role\":[{\"roleID\":\"7\",\"name\":\"D0 User\"}],\"reporters\":[]},{\"userID\":78001,\"branchID\":992,\"firstName\":\"SIT\",\"lastName\":\"testing\",\"supervisorUserID\":611,\"email\":\"7800@equitas.in\",\"CBSUserID\":\"7800\",\"role\":[{\"roleID\":\"12\",\"name\":\"QC\"},{\"roleID\":\"16\",\"name\":\"D2 User\"},{\"roleID\":\"7\",\"name\":\"D0 User\"}],\"reporters\":[]},{\"userID\":81111,\"branchID\":1004,\"firstName\":\"UAM Test\",\"lastName\":\"UAM Test\",\"supervisorUserID\":611,\"email\":\"e81111\",\"CBSUserID\":\"81111\",\"role\":[{\"roleID\":\"7\",\"name\":\"D0 User\"}],\"reporters\":[]},{\"userID\":98765,\"branchID\":1007,\"firstName\":\"RPA\",\"lastName\":\"TEST1\",\"supervisorUserID\":611,\"email\":\"987654\",\"CBSUserID\":\"987654\",\"role\":[{\"roleID\":\"8\",\"name\":\"Relationship Manager\"}],\"reporters\":[]},{\"userID\":125898,\"branchID\":1002,\"firstName\":\"Rpa\",\"lastName\":\"Test\",\"supervisorUserID\":611,\"email\":\"e125898\",\"CBSUserID\":\"125898\",\"role\":[{\"roleID\":\"8\",\"name\":\"Relationship Manager\"}],\"reporters\":[]},{\"userID\":312123,\"branchID\":1001,\"firstName\":\"Test\",\"lastName\":\"test\",\"supervisorUserID\":611,\"email\":\"e332233@esfbuat.in\",\"CBSUserID\":\"34234\",\"role\":[{\"roleID\":\"15\",\"name\":\"D1 User\"}],\"reporters\":[]},{\"userID\":406281,\"branchID\":9999,\"firstName\":\"Bala\",\"lastName\":\"Sekar\",\"supervisorUserID\":611,\"email\":\"e40628\",\"CBSUserID\":\"406281\",\"role\":[{\"roleID\":\"7\",\"name\":\"D0 User\"}],\"reporters\":[]},{\"userID\":2312232,\"branchID\":1056,\"firstName\":\"testing\",\"lastName\":\"t\",\"supervisorUserID\":611,\"email\":\"2312232@esfbuat.in\",\"CBSUserID\":\"2312232\",\"role\":[{\"roleID\":\"7\",\"name\":\"D0 User\"},{\"roleID\":\"12\",\"name\":\"QC\"},{\"roleID\":\"14\",\"name\":\"DVU\"},{\"roleID\":\"16\",\"name\":\"D2 User\"},{\"roleID\":\"18\",\"name\":\"Account Modification Maker\"},{\"roleID\":\"203\",\"name\":\"User Maker\"},{\"roleID\":\"204\",\"name\":\"User Checker\"}],\"reporters\":[]},{\"userID\":9976798,\"branchID\":1003,\"firstName\":\"errorutfguy\",\"lastName\":\"PARICIOPEREZ\",\"supervisorUserID\":611,\"email\":\"e0047411@esfbuat.in\",\"CBSUserID\":\"468465\",\"role\":[{\"roleID\":\"8\",\"name\":\"Relationship Manager\"}],\"reporters\":[]},{\"userID\":565565656,\"branchID\":11004,\"firstName\":\"mlhu\",\"lastName\":\"fhgfhjfd\",\"supervisorUserID\":611,\"email\":\"fcfd12_86878hgjfb@esfbuat.in\",\"CBSUserID\":\"565565656FDJFGDGFJF\",\"role\":[{\"roleID\":\"7\",\"name\":\"D0 User\"},{\"roleID\":\"15\",\"name\":\"D1 User\"}],\"reporters\":[]}]}";

    var dev = "{\"userID\":9001,\"branchID\":1002,\"firstName\":\"r\",\"lastName\":\"s\",\"supervisorUserID\":20654,\"email\":\"rs@equitas.in\",\"CBSUserID\":\"1001\",\"role\":[{\"roleID\":\"17\",\"name\":\"Customer Modification Maker\"},{\"roleID\":\"18\",\"name\":\"Account Modification Maker\"},{\"roleID\":\"21\",\"name\":\"SR Creator\"},{\"roleID\":\"50\",\"name\":\"nlManager\"},{\"roleID\":\"102\",\"name\":\"VendorCreator\"},{\"roleID\":\"105\",\"name\":\"Group Modification Maker\"},{\"roleID\":\"110\",\"name\":\"DSB User\"},{\"roleID\":\"111\",\"name\":\"Branch Maker\"},{\"roleID\":\"200\",\"name\":\"TAB User\"},{\"roleID\":\"204\",\"name\":\"User Checker\"},{\"roleID\":\"15\",\"name\":\"D1 User\"}],\"reporters\":[{\"userID\":20054,\"branchID\":1002,\"firstName\":\"Mugilan\",\"lastName\":\"N\",\"supervisorUserID\":9001,\"email\":\"mugilann@equitas.in\",\"CBSUserID\":\"20054\",\"role\":[{\"roleID\":\"200\",\"name\":\"TAB User\"},{\"roleID\":\"202\",\"name\":\"User Support\"},{\"roleID\":\"203\",\"name\":\"User Maker\"},{\"roleID\":\"7\",\"name\":\"D0 User\"},{\"roleID\":\"204\",\"name\":\"User Checker\"},{\"roleID\":\"13\",\"name\":\"Exception Checker\"},{\"roleID\":\"205\",\"name\":\"Master Checker\"},{\"roleID\":\"21\",\"name\":\"SR Creator\"},{\"roleID\":\"112\",\"name\":\"Branch Checker\"},{\"roleID\":\"51\",\"name\":\"nlUploader\"},{\"roleID\":\"111\",\"name\":\"Branch Maker\"},{\"roleID\":\"60\",\"name\":\"Form60 Uploader\"},{\"roleID\":\"104\",\"name\":\"VendorSuperVisor\"},{\"roleID\":\"108\",\"name\":\"Document Viewer\"},{\"roleID\":\"109\",\"name\":\"Admin Master\"}],\"reporters\":[{\"userID\":4242,\"branchID\":1002,\"firstName\":\"John\",\"lastName\":\"Dolittle\",\"supervisorUserID\":20054,\"email\":\"e4242@equitas.in\",\"CBSUserID\":\"4242\",\"role\":[{\"roleID\":\"7\",\"name\":\"D0 User\"}],\"reporters\":[]},{\"userID\":78674,\"branchID\":345,\"firstName\":\"create\",\"lastName\":\"newuser\",\"supervisorUserID\":20054,\"email\":\"a_cretenewuser@equitas.in\",\"CBSUserID\":\"78578676876847\",\"role\":[{\"roleID\":\"7\",\"name\":\"D0 User\"}],\"reporters\":[]},{\"userID\":4687468,\"branchID\":362,\"firstName\":\"admin\",\"lastName\":\"console\",\"supervisorUserID\":20054,\"email\":\"admin_comsole@equitas.in\",\"CBSUserID\":\"768473867438\",\"role\":[{\"roleID\":\"7\",\"name\":\"D0 User\"}],\"reporters\":[]},{\"userID\":7778889,\"branchID\":362,\"firstName\":\"corona\",\"lastName\":\"virus\",\"supervisorUserID\":20054,\"email\":\"corona@equitas.in\",\"CBSUserID\":\"77785345333333\",\"role\":[],\"reporters\":[]},{\"userID\":13051305,\"branchID\":1002,\"firstName\":\"naseema\",\"lastName\":\"K\",\"supervisorUserID\":20054,\"email\":\"13051305@equitas.in\",\"CBSUserID\":\"13051305sdsdfsd\",\"role\":[{\"roleID\":\"51\",\"name\":\"nlUploader\"},{\"roleID\":\"203\",\"name\":\"User Maker\"}],\"reporters\":[]},{\"userID\":52365236,\"branchID\":9999,\"firstName\":\"testsdas\",\"lastName\":\"ddd\",\"supervisorUserID\":20054,\"email\":\"52365236@equitas.in\",\"CBSUserID\":\"52365236\",\"role\":[{\"roleID\":\"12\",\"name\":\"QC\"}],\"reporters\":[]},{\"userID\":104751047,\"branchID\":1002,\"firstName\":\"test\",\"lastName\":\"t\",\"supervisorUserID\":20054,\"email\":\"10475ajeeS@equitas.in\",\"CBSUserID\":\"104751047510475Ajees\",\"role\":[{\"roleID\":\"7\",\"name\":\"D0 User\"}],\"reporters\":[]},{\"userID\":130811232,\"branchID\":1002,\"firstName\":\"test\",\"lastName\":\"sff\",\"supervisorUserID\":20054,\"email\":\"130811232@equitas.in\",\"CBSUserID\":\"130811232\",\"role\":[{\"roleID\":\"7\",\"name\":\"D0 User\"}],\"reporters\":[]},{\"userID\":130811233,\"branchID\":1002,\"firstName\":\"hgf\",\"lastName\":\"sw\",\"supervisorUserID\":20054,\"email\":\"130811233@equitas.in\",\"CBSUserID\":\"130811233\",\"role\":[{\"roleID\":\"7\",\"name\":\"D0 User\"}],\"reporters\":[]},{\"userID\":457812457,\"branchID\":11001,\"firstName\":\"sdfs\",\"lastName\":\"asdfs\",\"supervisorUserID\":20054,\"email\":\"e457812457@equitas.in\",\"CBSUserID\":\"457812457sfsfsfd\",\"role\":[{\"roleID\":\"2\",\"name\":\"Zonal Head\"}],\"reporters\":[]},{\"userID\":585858585,\"branchID\":9999,\"firstName\":\"sample\",\"lastName\":\"nkjh\",\"supervisorUserID\":20054,\"email\":\"sdc585858585@equitas.in\",\"CBSUserID\":\"585858585\",\"role\":[{\"roleID\":\"7\",\"name\":\"D0 User\"},{\"roleID\":\"9\",\"name\":\"Branch Business Correspondent Manager\"}],\"reporters\":[]},{\"userID\":666666666,\"branchID\":11001,\"firstName\":\"test\",\"lastName\":\"user\",\"supervisorUserID\":20054,\"email\":\"sd666666666@equitas.in\",\"CBSUserID\":\"666666666sdsdsdASSDA\",\"role\":[{\"roleID\":\"7\",\"name\":\"D0 User\"}],\"reporters\":[]},{\"userID\":741258741,\"branchID\":371,\"firstName\":\"test\",\"lastName\":\"fsdhfh\",\"supervisorUserID\":20054,\"email\":\"741258741@equitas.in\",\"CBSUserID\":\"sdfsdfsd776764673636\",\"role\":[{\"roleID\":\"4\",\"name\":\"Cluster Branch Manager\"},{\"roleID\":\"5\",\"name\":\"Branch Manager\"},{\"roleID\":\"14\",\"name\":\"DVU\"}],\"reporters\":[]},{\"userID\":784595116,\"branchID\":1002,\"firstName\":\"hfrjhe\",\"lastName\":\"jsh\",\"supervisorUserID\":20054,\"email\":\"ltschecker@equitas.in\",\"CBSUserID\":\"784595116wdqdwdwdsds\",\"role\":[{\"roleID\":\"3\",\"name\":\"Regional Head\"}],\"reporters\":[]},{\"userID\":787878787,\"branchID\":1002,\"firstName\":\"xdfd\",\"lastName\":\"sdfds\",\"supervisorUserID\":20054,\"email\":\"ee787878787@equitas.in\",\"CBSUserID\":\"vassdasdad787878787\",\"role\":[{\"roleID\":\"2\",\"name\":\"Zonal Head\"}],\"reporters\":[]},{\"userID\":789798789,\"branchID\":362,\"firstName\":\"new\",\"lastName\":\"user\",\"supervisorUserID\":20054,\"email\":\"newuser@equitas.in\",\"CBSUserID\":\"456456456456\",\"role\":[{\"roleID\":\"7\",\"name\":\"D0 User\"},{\"roleID\":\"7\",\"name\":\"D0 User\"},{\"roleID\":\"7\",\"name\":\"D0 User\"},{\"roleID\":\"7\",\"name\":\"D0 User\"},{\"roleID\":\"7\",\"name\":\"D0 User\"},{\"roleID\":\"7\",\"name\":\"D0 User\"}],\"reporters\":[]},{\"userID\":954612315,\"branchID\":1002,\"firstName\":\"test\",\"lastName\":\"asda\",\"supervisorUserID\":20054,\"email\":\"ltsmaker@equitas.in\",\"CBSUserID\":\"954612315sdasdsdfsdf\",\"role\":[{\"roleID\":\"6\",\"name\":\"Branch Operations Manager\"}],\"reporters\":[]},{\"userID\":985623145,\"branchID\":1002,\"firstName\":\"habsdh\",\"lastName\":\"dnjksn\",\"supervisorUserID\":20054,\"email\":\"we985623145@equitas.in\",\"CBSUserID\":\"985623145scdascasdas\",\"role\":[{\"roleID\":\"5\",\"name\":\"Branch Manager\"},{\"roleID\":\"6\",\"name\":\"Branch Operations Manager\"}],\"reporters\":[]},{\"userID\":999999999,\"branchID\":11001,\"firstName\":\"testguhg\",\"lastName\":\"kmkvbskdfb\",\"supervisorUserID\":20054,\"email\":\"e999999999@equitas.in\",\"CBSUserID\":\"666666sdsdssssssssss\",\"role\":[{\"roleID\":\"2\",\"name\":\"Zonal Head\"},{\"roleID\":\"7\",\"name\":\"D0 User\"}],\"reporters\":[]}]},{\"userID\":68140,\"branchID\":1002,\"firstName\":\"Anandakumar\",\"lastName\":\"S\",\"supervisorUserID\":9001,\"email\":\"anands123@equitas.in\",\"CBSUserID\":\"68140\",\"role\":[{\"roleID\":\"200\",\"name\":\"TAB User\"}],\"reporters\":[{\"userID\":8000000,\"branchID\":1107,\"firstName\":\"Anna Nagar Tab User 1\",\"lastName\":\"TabD0\",\"supervisorUserID\":68140,\"email\":\"antab1@equitas.in\",\"CBSUserID\":\"8000000\",\"role\":[{\"roleID\":\"7\",\"name\":\"D0 User\"},{\"roleID\":\"21\",\"name\":\"SR Creator\"}],\"reporters\":[]}]},{\"userID\":654321,\"branchID\":1002,\"firstName\":\"Admin\",\"lastName\":\"Master\",\"supervisorUserID\":9001,\"email\":\"adminm@equitas.in\",\"CBSUserID\":\"20054\",\"role\":[{\"roleID\":\"109\",\"name\":\"Admin Master\"}],\"reporters\":[]},{\"userID\":45454545,\"branchID\":1004,\"firstName\":\"test\",\"lastName\":\"dtretre\",\"supervisorUserID\":9001,\"email\":\"45454545@equitas.in\",\"CBSUserID\":\"45454545uyfuyghgyitu\",\"role\":[{\"roleID\":\"7\",\"name\":\"D0 User\"},{\"roleID\":\"13\",\"name\":\"Exception Checker\"},{\"roleID\":\"15\",\"name\":\"D1 User\"},{\"roleID\":\"17\",\"name\":\"Customer Modification Maker\"},{\"roleID\":\"18\",\"name\":\"Account Modification Maker\"},{\"roleID\":\"50\",\"name\":\"nlManager\"}],\"reporters\":[]},{\"userID\":200000000,\"branchID\":371,\"firstName\":\"dfnjgfsdfbhbsdhd\",\"lastName\":\"jdbjhsddvj\",\"supervisorUserID\":9001,\"email\":\"sd200000000@equitas.in\",\"CBSUserID\":\"200000000edfadfjkBHB\",\"role\":[{\"roleID\":\"7\",\"name\":\"D0 User\"}],\"reporters\":[]}]}"

    var nas ="{\"userID\":\"1008\",\"branchID\":9999,\"firstName\":\"Test4\",\"lastName\":null,\"supervisorUserID\":\"so_annapoorna\",\"email\":\"e55555@equitasbank.in\",\"CBSUserID\":\" \",\"role\":[{\"roleID\":\"5\",\"name\":\"Branch Credit Manager\"}],\"reporters\":[{\"userID\":\"1009\",\"branchID\":100,\"firstName\":\"Test5\",\"lastName\":null,\"supervisorUserID\":\"1008\",\"email\":\"e66666@equitasbank.in\",\"CBSUserID\":\" \",\"role\":[{\"roleID\":\"1\",\"name\":\"Sales Officer\"}],\"reporters\":[]},{\"userID\":\"1010\",\"branchID\":100,\"firstName\":\"Test7\",\"lastName\":null,\"supervisorUserID\":\"1008\",\"email\":\"e77777@equitasbank.in\",\"CBSUserID\":\" \",\"role\":[],\"reporters\":[]},{\"userID\":\"2229\",\"branchID\":100,\"firstName\":\"shantha\",\"lastName\":null,\"supervisorUserID\":\"1008\",\"email\":\"shantha_sales@equitasbank.in\",\"CBSUserID\":\" \",\"role\":[{\"roleID\":\"1\",\"name\":\"Sales Officer\"}],\"reporters\":[]},{\"userID\":\"2230\",\"branchID\":100,\"firstName\":\"maruthu\",\"lastName\":null,\"supervisorUserID\":\"1008\",\"email\":\"maruthu_sales@equitasbank.in\",\"CBSUserID\":\" \",\"role\":[{\"roleID\":\"1\",\"name\":\"Sales Officer\"}],\"reporters\":[]},{\"userID\":\"1011\",\"branchID\":9999,\"firstName\":\"Test8\",\"lastName\":null,\"supervisorUserID\":\"1008\",\"email\":\"e88888@equitasbank.in\",\"CBSUserID\":\" \",\"role\":[],\"reporters\":[]},{\"userID\":\"2231\",\"branchID\":100,\"firstName\":\"maruthu\",\"lastName\":null,\"supervisorUserID\":\"1008\",\"email\":\"maruthu_credit@equitasbank.in\",\"CBSUserID\":\" \",\"role\":[{\"roleID\":\"4\",\"name\":\"Credit Officer\"}],\"reporters\":[]},{\"userID\":\"2234\",\"branchID\":100,\"firstName\":\"ashwin\",\"lastName\":null,\"supervisorUserID\":\"1008\",\"email\":\"ashwin_credit@equitasbank.in\",\"CBSUserID\":\" \",\"role\":[{\"roleID\":\"4\",\"name\":\"Credit Officer\"}],\"reporters\":[]},{\"userID\":\"1012\",\"branchID\":100,\"firstName\":\"Test9\",\"lastName\":null,\"supervisorUserID\":\"1008\",\"email\":\"e99999@equitasbank.in\",\"CBSUserID\":\" \",\"role\":[],\"reporters\":[]},{\"userID\":\"1013\",\"branchID\":100,\"firstName\":\"Test10\",\"lastName\":null,\"supervisorUserID\":\"1008\",\"email\":\"e10000@equitasbank.in\",\"CBSUserID\":\" \",\"role\":[],\"reporters\":[]},{\"userID\":\"2232\",\"branchID\":100,\"firstName\":\"gokul\",\"lastName\":null,\"supervisorUserID\":\"1008\",\"email\":\"gokul_credit@equitasbank.in\",\"CBSUserID\":\" \",\"role\":[{\"roleID\":\"4\",\"name\":\"Credit Officer\"}],\"reporters\":[]}]}"
    var arrayList = JSON.parse(sit);
    this.TREE_DATA.push(arrayList);
    this.dataSource.data = this.TREE_DATA;

    console.log('treeData', this.TREE_DATA)
    console.log('child', this.hasChild)
  }

  hasChild = (_: number, node: TeamNode) => !!node.reporters && node.reporters.length > 0;


  roleCheck(node) {
    this.reporterUserID = null;
    this.roleUserID = null;
    var a = node.userID;
    console.log('user-role-list_' + a);
    // if(node.email == ){ //loginned Email Id should be same
    //   console.log("Current user can not act as a supervisor for own")
    //   return true;
    // }

    this.rolelist = [];
    $(".parent-list").toggle();
    $(".child-list").toggle();
    console.log(node)
    // if (node.role.length == 0) {
    //   alert("No Roles Available")
    // } else {
    //   this.roleUserID = node.userID;
    //   this.rolelist = node.role     
    // }
    this.roleUserID = node.userID;
    this.rolelist = node.role;
    if (node.role.length == 0) {
      this.rolelist=[{roleID: "", name: "No Roles Available"}]
    }
  }



  reporterCheck(node) {
    console.log(node)
    this.reporterUserID = null;
    this.roleUserID = null;
    //  this.changebutton=this.changebutton?false:true;
    //this.repBttnId=node.userID;

    if (node.reporters.length == 0) {
      this.reporterUserID = node.userID;
      //alert("No Reportering Users available");
    } else {
      this.roleUserID = node.userID;
    }
  }


  filterChanged(filterText) {
    //this.dataSource.data.filter(filterText);
    if (filterText) {
      this.dataSource.data = this.TREE_DATA.filter(currentlist => {
        if (currentlist.firstName && filterText) {
          if (currentlist.firstName.toLowerCase().indexOf(filterText.toLowerCase()) > -1) {
            return true;
          } else if (currentlist.reporters) {
            currentlist.reporters.forEach(element => {
              if (element.firstName.toLowerCase() == filterText.toLowerCase())
                this.treeControl.isExpanded;
              this.dataSource.data.push(element);
              return false
            })
            //this.dataSource.data = this.dataSource.data
          }
        }
      })
    } else {
      this.dataSource.data = this.TREE_DATA;
    }

  }

  public onkeyup(value: string): void {
    this.dataSource.data = this.search(this.TREE_DATA, value);
    this.treeControl.dataNodes=this.dataSource.data; //dataSource data should be stored in dataNodes of treeControl to work expandAll/CollapseAll
    this.treeControl.expandAll();
    if(!value){
      this.treeControl.collapseAll();
    }
  }

  public search(reporters: any[], term: string): any[] {
    return reporters.reduce((acc, item) => {
      console.log(item)
      if (this.contains(item.firstName, term)) {
        acc.push(item);
      } else if (item.reporters && item.reporters.length > 0) {
        const newItems = this.search(item.reporters, term);

        if (newItems.length > 0) {
          acc.push({ userID:item.userID,firstName: item.firstName, reporters: newItems,role:item.role,email:item.email});//push the keys which required.
        }
      }

      return acc;
    },
      []);
  }

  public contains(firstName: string, term: string): boolean {
    return firstName.toLowerCase().indexOf(term.toLowerCase()) >= 0;
  }

  getTeamList() { //supervisorRelated
    this.supervisorService
      .getTeamDetails()
      .subscribe((res: any) => {
        if(res.Error=='0'){
          var resData = res.ProcessVariables.orgStructure;
          console.log(resData)
           var arrayList = JSON.parse(resData);
          this.TREE_DATA.push(arrayList);
           this.dataSource.data = this.TREE_DATA;

        }
      
      });
  }

}



$('body').click(function () {
  $('.child-list').hide();
  //  $('.parent-list').hide();
});

