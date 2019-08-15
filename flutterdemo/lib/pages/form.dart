import 'package:flutter/material.dart';

class form extends StatelessWidget{
  @override
    Widget build(BuildContext context) {
      // TODO: implement build
      return Scaffold(
        appBar:AppBar(
          title:Text('表单页面')
        ),
        body:ListView(
          children: <Widget>[
            ListTile(
              title:Text('haha')
            ),
            ListTile(
              title:Text('haha')
            ),
            ListTile(
              title:Text('haha')
            )
          ],
        ),
      );
    }
}
