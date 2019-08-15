import 'package:flutter/material.dart';
import './pages/tabs.dart';

void main() => runApp(Myapp());

class Myapp extends StatelessWidget{
  @override
    Widget build(BuildContext context) {
      // TODO: implement build
      return MaterialApp(
        home:Tabs()
      );
    }
}
