import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

const BrandLogo = () => (
    <div className="flex items-center space-x-2">
        <div className="bg-blue-600 p-2 rounded-lg">
            <ShieldCheck className="text-white h-6 w-6" />
        </div>
        <span className="text-2xl font-bold text-gray-800">Praxform</span>
    </div>
);

export default BrandLogo;