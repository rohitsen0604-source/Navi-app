import 'package:flutter/material.dart';
import 'duty_tab.dart';
import 'history_tab.dart';
import 'earnings_tab.dart';
import 'profile_tab.dart';

class DriverMainNavScreen extends StatefulWidget {
  const DriverMainNavScreen({super.key});

  @override
  State<DriverMainNavScreen> createState() => _DriverMainNavScreenState();
}

class _DriverMainNavScreenState extends State<DriverMainNavScreen> {
  int _currentIndex = 0;

  final List<Widget> _tabs = const [
    DutyTab(),
    HistoryTab(),
    EarningsTab(),
    ProfileTab(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _tabs,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _currentIndex,
        onTap: (index) => setState(() => _currentIndex = index),
        type: BottomNavigationBarType.fixed,
        selectedItemColor: const Color(0xFF0D9488),
        unselectedItemColor: Colors.grey.shade500,
        selectedLabelStyle: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
        unselectedLabelStyle: const TextStyle(fontSize: 12),
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.waves),
            activeIcon: Icon(Icons.waves, color: Color(0xFF0D9488)),
            label: 'Duty Desk',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.history),
            label: 'Trips',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.account_balance_wallet_outlined),
            activeIcon: Icon(Icons.account_balance_wallet),
            label: 'Earnings',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person_outline),
            activeIcon: Icon(Icons.person),
            label: 'Profile & KYC',
          ),
        ],
      ),
    );
  }
}
