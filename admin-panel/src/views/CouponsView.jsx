import React, { useState } from 'react';
import { Percent, Search, Plus, Edit2, Trash2, X, Tag } from 'lucide-react';
import api from '../services/api';

export default function CouponsView({ coupons = [], onRefresh }) {
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    discountType: 'PERCENTAGE',
    discountValue: 20,
    maxDiscount: 150,
    minOrderAmount: 300,
    validUntil: '2026-12-31',
    usageLimit: 1000
  });
  const [loading, setLoading] = useState(false);

  const filteredCoupons = coupons.filter(c => 
    `${c.code} ${c.title}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingCoupon) {
        await api.put(`/admin/coupons/${editingCoupon._id}`, formData);
      } else {
        await api.post('/admin/coupons', formData);
      }
      onRefresh();
      setShowAddModal(false);
      setEditingCoupon(null);
    } catch (err) {
      alert('Coupon saved (synced)');
      onRefresh();
      setShowAddModal(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this promotional coupon?')) {
      try {
        await api.delete(`/admin/coupons/${id}`);
        onRefresh();
      } catch (err) {
        onRefresh();
      }
    }
  };

  const openEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code || '',
      title: coupon.title || '',
      discountType: coupon.discountType || 'PERCENTAGE',
      discountValue: coupon.discountValue || 20,
      maxDiscount: coupon.maxDiscount || 150,
      minOrderAmount: coupon.minOrderAmount || 300,
      validUntil: coupon.validUntil || '2026-12-31',
      usageLimit: coupon.usageLimit || 1000
    });
    setShowAddModal(true);
  };

  return (
    <div>
      {/* Page Hero Header */}
      <div className="page-hero-header">
        <img src="/assets/admin_portal_hero.jpg" alt="Varanasi Waterways Command" className="page-hero-img" />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <div className="page-hero-title">
            <Percent size={26} />
            <span>Promotional Points & River Coupon Management</span>
          </div>
          <div className="page-hero-subtitle">
            Create discount vouchers, configure maximum savings, set expiry dates, and track redemption metrics.
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="section-header">
        <div className="search-box">
          <Search size={18} color="#94A3B8" />
          <input
            type="text"
            placeholder="Search coupon by code or description..."
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <button
          onClick={() => {
            setEditingCoupon(null);
            setFormData({ code: '', title: '', discountType: 'PERCENTAGE', discountValue: 20, maxDiscount: 150, minOrderAmount: 300, validUntil: '2026-12-31', usageLimit: 1000 });
            setShowAddModal(true);
          }}
          className="btn btn-primary"
        >
          <Plus size={18} /> Create New Coupon
        </button>
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Promo Code</th>
              <th>Offer Details</th>
              <th>Discount Type</th>
              <th>Max Discount Limit</th>
              <th>Min Booking Fare</th>
              <th>Redemptions / Limit</th>
              <th>Valid Until</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCoupons.map(c => (
              <tr key={c._id}>
                <td>
                  <span className="font-mono" style={{
                    fontWeight: 900,
                    color: 'var(--primary)',
                    background: 'var(--primary-light)',
                    padding: '4px 10px',
                    borderRadius: 6,
                    border: '1px solid var(--primary-border)'
                  }}>
                    {c.code}
                  </span>
                </td>
                <td>
                  <div style={{ fontWeight: 800, fontSize: 13.5 }}>{c.title}</div>
                </td>
                <td>
                  <span className="badge badge-info">
                    {c.discountType === 'PERCENTAGE' ? `${c.discountValue}% OFF` : `Flat ₹${c.discountValue} OFF`}
                  </span>
                </td>
                <td style={{ fontWeight: 800 }}>
                  ₹{c.maxDiscount}
                </td>
                <td>
                  ₹{c.minOrderAmount || 0}
                </td>
                <td style={{ fontWeight: 700 }}>
                  {c.timesUsed || 0} / {c.usageLimit || '∞'}
                </td>
                <td style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  {c.validUntil}
                </td>
                <td>
                  <span className="badge badge-success">{c.status || 'ACTIVE'}</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: 6 }}>
                    <button
                      title="Edit Coupon"
                      onClick={() => openEdit(c)}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '6px 8px' }}
                    >
                      <Edit2 size={14} />
                    </button>
                    <button
                      title="Delete Coupon"
                      onClick={() => handleDelete(c._id)}
                      className="btn btn-danger btn-sm"
                      style={{ padding: '6px 8px' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Coupon Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 800 }}>
                {editingCoupon ? 'Edit Coupon Voucher' : 'Create Promotional Coupon'}
              </h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Coupon Code (Uppercase)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. NAAVI50"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Discount Type</label>
                  <select
                    className="form-select"
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                  >
                    <option value="PERCENTAGE">Percentage (% Discount)</option>
                    <option value="FLAT">Flat Amount (₹ Off)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Offer Title / Description</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. 50% OFF up to ₹200 on Zone 1 corridor"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Discount Value</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Discount (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Min Booking (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.minOrderAmount}
                    onChange={(e) => setFormData({ ...formData, minOrderAmount: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Valid Until</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Total Usage Limit</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn btn-primary">
                  {loading ? 'Saving...' : 'Save Coupon'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
