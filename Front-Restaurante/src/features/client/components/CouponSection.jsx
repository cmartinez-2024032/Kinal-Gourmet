import React, { useState } from 'react';
import { useCartStore } from '../store/UseCartStore.js';

const CouponSection = ({ userId, restaurantId }) => {
    const [couponCode, setCouponCode] = useState("");
    const { applyCoupon, appliedCoupon, removeCoupon, isApplyingCoupon } = useCartStore();

    const handleApply = async () => {
        if (!couponCode.trim()) return;
        
        // Llamamos a la función del store que conectará con tu controlador
        const result = await applyCoupon(couponCode, userId, restaurantId);
        
        if (!result.success) {
            // Aquí puedes usar un Toast o una alerta simple
            alert(result.message); 
        }
    };

    return (
        <div style={{ padding: '15px 0', borderTop: '1px solid #eee' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input 
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="¿TIENES UN CUPÓN?"
                    disabled={!!appliedCoupon || isApplyingCoupon}
                    style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '10px',
                        border: '1px solid #ddd',
                        textTransform: 'uppercase'
                    }}
                />
                
                {appliedCoupon ? (
                    <button 
                        onClick={() => { removeCoupon(); setCouponCode(""); }}
                        style={{ position: 'absolute', right: '10px', color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}
                    >
                        ✕
                    </button>
                ) : (
                    <button 
                        onClick={handleApply}
                        disabled={isApplyingCoupon || !couponCode}
                        style={{ 
                            position: 'absolute', 
                            right: '10px', 
                            backgroundColor: '#000', 
                            color: '#fff', 
                            border: 'none', 
                            padding: '5px 12px', 
                            borderRadius: '5px',
                            cursor: 'pointer',
                            opacity: (isApplyingCoupon || !couponCode) ? 0.5 : 1
                        }}
                    >
                        {isApplyingCoupon ? '...' : 'APLICAR'}
                    </button>
                )}
            </div>
            
            {appliedCoupon && (
                <p style={{ color: 'green', fontSize: '0.8rem', marginTop: '5px' }}>
                    ¡Cupón <b>{appliedCoupon.code}</b> aplicado con éxito!
                </p>
            )}
        </div>
    );
};

export default CouponSection;