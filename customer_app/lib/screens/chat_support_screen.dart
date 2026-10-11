import 'dart:async';
import 'package:flutter/material.dart';

class ChatSupportScreen extends StatefulWidget {
  final String? initialTopic;

  const ChatSupportScreen({super.key, this.initialTopic});

  @override
  State<ChatSupportScreen> createState() => _ChatSupportScreenState();
}

class _ChatSupportScreenState extends State<ChatSupportScreen> {
  final TextEditingController _messageController = TextEditingController();
  final ScrollController _scrollController = ScrollController();

  final List<Map<String, dynamic>> _messages = [
    {
      'isUser': false,
      'text': 'Namaste! 🙏 Welcome to Naavi Varanasi Waterways Support.\n\nI am your 24/7 Ganga Assistant. I can help you with boat bookings, Ghat boarding points, Aarti schedules, fares, and safety regulations.',
      'time': 'Just now',
    },
  ];

  bool _isTyping = false;

  final List<String> _quickSuggestions = [
    '🌅 Subah-e-Banaras Sunrise Timings',
    '🪔 Ganga Aarti Best View Ghats',
    '🚤 Motor Boat vs Bajra Fare Difference',
    '🛡️ Safety Rules & Life Jackets',
    '💰 Cancellation & Refund Policy',
    '📍 How to reach Dashashwamedh Ghat',
    '📞 Talk to Emergency Water Police',
  ];

  @override
  void initState() {
    super.initState();
    if (widget.initialTopic != null) {
      _sendMessage(widget.initialTopic!);
    }
  }

  @override
  void dispose() {
    _messageController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _sendMessage(String text) {
    if (text.trim().isEmpty) return;

    final userMsg = text.trim();
    _messageController.clear();

    setState(() {
      _messages.add({
        'isUser': true,
        'text': userMsg,
        'time': _getCurrentTime(),
      });
      _isTyping = true;
    });

    _scrollToBottom();

    // Generate intelligent AI response after short delay
    Timer(const Duration(milliseconds: 1000), () {
      final reply = _generateBotReply(userMsg);
      if (mounted) {
        setState(() {
          _isTyping = false;
          _messages.add({
            'isUser': false,
            'text': reply,
            'time': _getCurrentTime(),
          });
        });
        _scrollToBottom();
      }
    });
  }

  String _getCurrentTime() {
    final now = DateTime.now();
    final hour = now.hour % 12 == 0 ? 12 : now.hour % 12;
    final min = now.minute.toString().padLeft(2, '0');
    final ampm = now.hour >= 12 ? 'PM' : 'AM';
    return '$hour:$min $ampm';
  }

  void _scrollToBottom() {
    Timer(const Duration(milliseconds: 100), () {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  String _generateBotReply(String query) {
    final q = query.toLowerCase();

    if (q.contains('sunrise') || q.contains('subah')) {
      return '🌅 Subah-e-Banaras Sunrise Tours operate daily between 05:30 AM and 07:30 AM.\n\n• Best Boarding Ghat: Assi Ghat (Zone 1) & Dashashwamedh Ghat (Zone 2).\n• Highlights: Morning Ganga Snan view, Sun darshan, Vedic chanting at Assi, and Manikarnika morning vista.\n• Recommended Vessel: Silent Hand-Row Boat or Eco Motor Boat for serene experience.';
    }

    if (q.contains('aarti') || q.contains('dashashwamedh')) {
      return '🪔 Dashashwamedh Maha Ganga Aarti timings:\n\n• Evening: 06:30 PM - 07:30 PM (Summer: 07:00 PM).\n• Best vantage point: Anchored Luxury Bajra or Motor Boat directly facing Dashashwamedh / Rajendra Prasad Ghat.\n• Tip: Book an Evening Aarti slot at least 45 minutes in advance so your boat can anchor in the front row!';
    }

    if (q.contains('motor') || q.contains('bajra') || q.contains('fare') || q.contains('price')) {
      return '🚤 Naavi Vessel Categories & Fares in Varanasi:\n\n1. Standard Hand-Row Boat: ₹300 - ₹500 (Ideal for couples & peaceful morning rides, 2-6 Pax).\n2. Standard Motor Boat: ₹600 - ₹1,200 (Best for family rides covering 84 Ghats, 8-15 Pax).\n3. Luxury Heritage Bajra: ₹2,000 - ₹5,000 (Two-deck royal vessel with sofas & Aarti terrace, 20-40 Pax).\n4. High-Speed Boat: ₹1,500 - ₹2,500 (Swift river transit across zones).\n\nAll fares are regulated by Varanasi Waterways Authority with zero haggling!';
    }

    if (q.contains('cancel') || q.contains('refund')) {
      return '💰 Official Naavi Cancellation & Refund Policy:\n\n• Cancel > 12 Hours before ride: 80% Instant Refund\n• Cancel 6 - 12 Hours before: 70% Refund\n• Cancel 3 - 6 Hours before: 50% Refund\n• Cancel < 3 Hours or Book Now: Non-refundable (0%)\n\nRefunds are directly credited to your original payment method within 2-4 hours for UPI.';
    }

    if (q.contains('safety') || q.contains('life jacket')) {
      return '🛡️ Varanasi Waterways Safety Protocols:\n\n• Life jackets are 100% COMPULSORY for all passengers before boat departure.\n• Every Naavi boat is equipped with ISI certified life jackets, life buoys, and emergency trackers.\n• Boats do not operate during high Ganga flood currents or severe fog advisory.\n• You can tap "Emergency SOS" anytime during a ride for water police assistance.';
    }

    if (q.contains('helpline') || q.contains('call') || q.contains('police') || q.contains('emergency')) {
      return '📞 Important Varanasi Waterways Helpline Numbers:\n\n• Naavi 24/7 Operations: +91 98765 43210\n• Varanasi Water Police: 112 / +91 542 2508000\n• NDRF Dashashwamedh Post: 1077\n• Ambulance / Ghat Medical Post: 108\n\nYou can also trigger instant live tracking from the Emergency SOS screen in the app.';
    }

    return 'Thank you for reaching out! 🙏\n\nRegarding "$query", our local Varanasi operations team is monitoring this thread. You can book rides directly from Home, track upcoming journeys in My Rides, or call our 24/7 Ghat Helpline (+91 98765 43210). Can I assist you with booking or Ghat directions?';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0.5,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Color(0xFF0F172A)),
          onPressed: () => Navigator.pop(context),
        ),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(7),
              decoration: const BoxDecoration(
                color: Color(0xFFFFF1EE),
                shape: BoxShape.circle,
              ),
              child: const Icon(Icons.support_agent_rounded, color: Color(0xFFEB4D37), size: 22),
            ),
            const SizedBox(width: 10),
            const Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Naavi Ganga Assistant',
                    style: TextStyle(
                      color: Color(0xFF0F172A),
                      fontSize: 15.5,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  Row(
                    children: [
                      Icon(Icons.circle, color: Color(0xFF10B981), size: 8),
                      SizedBox(width: 4),
                      Text(
                        'Online • 24/7 Waterways Support',
                        style: TextStyle(fontSize: 11, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      body: SafeArea(
        child: Column(
          children: [
            // Quick Suggestion Chips
            Container(
              height: 48,
              padding: const EdgeInsets.symmetric(vertical: 6),
              color: Colors.white,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                padding: const EdgeInsets.symmetric(horizontal: 16),
                itemCount: _quickSuggestions.length,
                separatorBuilder: (_, _) => const SizedBox(width: 8),
                itemBuilder: (context, i) {
                  return ActionChip(
                    label: Text(_quickSuggestions[i]),
                    backgroundColor: const Color(0xFFF1F5F9),
                    labelStyle: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w600, color: Color(0xFF334155)),
                    side: const BorderSide(color: Color(0xFFE2E8F0)),
                    onPressed: () => _sendMessage(_quickSuggestions[i]),
                  );
                },
              ),
            ),

            const Divider(height: 1, color: Color(0xFFE2E8F0)),

            // Messages List
            Expanded(
              child: ListView.builder(
                controller: _scrollController,
                padding: const EdgeInsets.all(16),
                itemCount: _messages.length,
                itemBuilder: (context, i) {
                  final msg = _messages[i];
                  final isUser = msg['isUser'] == true;
                  return _buildMessageBubble(
                    text: msg['text'],
                    time: msg['time'],
                    isUser: isUser,
                  );
                },
              ),
            ),

            // Typing Indicator
            if (_isTyping)
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
                alignment: Alignment.centerLeft,
                child: Row(
                  children: [
                    const SizedBox(
                      width: 14,
                      height: 14,
                      child: CircularProgressIndicator(color: Color(0xFFEB4D37), strokeWidth: 2),
                    ),
                    const SizedBox(width: 10),
                    Text(
                      'Ganga Assistant is typing...',
                      style: TextStyle(fontSize: 12, color: Colors.grey[600], fontStyle: FontStyle.italic),
                    ),
                  ],
                ),
              ),

            // Message Input Bar
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
              decoration: const BoxDecoration(
                color: Colors.white,
                border: Border(top: BorderSide(color: Color(0xFFE2E8F0))),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: _messageController,
                      style: const TextStyle(fontSize: 14),
                      decoration: InputDecoration(
                        hintText: 'Ask about boat rides, Aarti, ghats...',
                        hintStyle: const TextStyle(fontSize: 13, color: Color(0xFF94A3B8)),
                        filled: true,
                        fillColor: const Color(0xFFF8FAFC),
                        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                        border: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                          borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(24),
                          borderSide: const BorderSide(color: Color(0xFFEB4D37), width: 1.5),
                        ),
                      ),
                      onSubmitted: _sendMessage,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Container(
                    decoration: const BoxDecoration(
                      color: Color(0xFFEB4D37),
                      shape: BoxShape.circle,
                    ),
                    child: IconButton(
                      icon: const Icon(Icons.send_rounded, color: Colors.white, size: 20),
                      onPressed: () => _sendMessage(_messageController.text),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMessageBubble({
    required String text,
    required String time,
    required bool isUser,
  }) {
    return Align(
      alignment: isUser ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 6),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.8),
        decoration: BoxDecoration(
          color: isUser ? const Color(0xFFEB4D37) : Colors.white,
          borderRadius: BorderRadius.only(
            topLeft: const Radius.circular(18),
            topRight: const Radius.circular(18),
            bottomLeft: Radius.circular(isUser ? 18 : 4),
            bottomRight: Radius.circular(isUser ? 4 : 18),
          ),
          border: isUser ? null : Border.all(color: const Color(0xFFE2E8F0)),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withValues(alpha: 0.02),
              blurRadius: 6,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Column(
          crossAxisAlignment: isUser ? CrossAxisAlignment.end : CrossAxisAlignment.start,
          children: [
            Text(
              text,
              style: TextStyle(
                fontSize: 13.5,
                height: 1.4,
                color: isUser ? Colors.white : const Color(0xFF0F172A),
              ),
            ),
            const SizedBox(height: 4),
            Text(
              time,
              style: TextStyle(
                fontSize: 10,
                color: isUser ? Colors.white70 : const Color(0xFF94A3B8),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
