import 'package:flutter_test/flutter_test.dart';
import 'package:driver_app/main.dart';

void main() {
  testWidgets('Driver app smoke test', (WidgetTester tester) async {
    await tester.pumpWidget(const NaaviDriverApp());
    expect(find.text('Naavi Boatman Partner'), findsOneWidget);
  });
}
