import 'package:flutter/material.dart';
import './pages1/pages1.dart';
import './pages1/pages2.dart';
import './pages1/pages3.dart';
import './pages1/pages4.dart';

void main() => runApp(MyApp());


class MyApp extends StatelessWidget {
  @override
    Widget build(BuildContext context) {
      // TODO: implement build
      return MaterialApp(
        home:Tabs()
      );
    }
}

class Tabs extends StatefulWidget{
  @override
    State<StatefulWidget> createState() {
      // TODO: implement createState
      return TabsCon();
    }
}

class TabsCon extends State<Tabs>{
  var page = 3;
  var pages = [Pages1(),Pages2(),Pages3(),Pages4()];
  @override
    Widget build(BuildContext context) {
      // TODO: implement build
      return Scaffold(
          appBar: AppBar(
            title:Text('app demo')
          ),
          body:this.pages[this.page],
          floatingActionButton: FloatingActionButton(
            child:Icon(Icons.accessibility)
          ),
          bottomNavigationBar: BottomNavigationBar(
            items:[
              BottomNavigationBarItem(
                icon:Icon(Icons.ac_unit),
                title:Text('page1')
              ),
              BottomNavigationBarItem(
                icon:Icon(Icons.access_alarm),
                title:Text('page2')
              ),
              BottomNavigationBarItem(
                icon:Icon(Icons.backspace),
                title:Text('page3')
              ),
              BottomNavigationBarItem(
                icon:Icon(Icons.backup),
                title:Text('page4')
              )
            ],
            currentIndex: this.page,
            onTap: (num){
              setState(() {
                this.page = num;
              });
              print(num);
            },
            type: BottomNavigationBarType.fixed
          ),
        );
    }
}
