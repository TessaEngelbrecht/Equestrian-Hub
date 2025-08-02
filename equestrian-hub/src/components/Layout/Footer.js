import React from 'react'
import { MapPin, Phone, Mail, Heart, Facebook, Instagram, Twitter } from 'lucide-react'

const Footer = () => {
    return (
        <footer className="bg-primary text-black mt-16">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <span className="text-xl font-display font-bold">
                                Meadowbrook Equestrian
                            </span>
                        </div>
                        <p className="text-black mb-4 max-w-md">
                            Your premier destination for equestrian excellence. We provide quality horse supplies,
                            professional riding instruction, and a community that shares your passion for horses.
                        </p>
                        <div className="flex space-x-4">
                            <Facebook size={20} className="text-green-200 hover:text-black cursor-pointer transition-colors" />
                            <Instagram size={20} className="text-green-200 hover:text-black cursor-pointer transition-colors" />
                            <Twitter size={20} className="text-green-200 hover:text-black cursor-pointer transition-colors" />
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-black">
                            <li><a href="/" className="hover:text-black transition-colors">Home</a></li>
                            <li><a href="/shop" className="hover:text-black transition-colors">Shop</a></li>
                            <li><a href="/lessons" className="hover:text-black transition-colors">Lessons</a></li>
                            <li><a href="/about" className="hover:text-black transition-colors">About Us</a></li>
                            <li><a href="/contact" className="hover:text-black transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="font-semibold text-lg mb-4">Contact</h3>
                        <div className="space-y-3 text-black">
                            <div className="flex items-start space-x-2">
                                <MapPin size={16} className="mt-1 flex-shrink-0" />
                                <span className="text-sm">
                                    123 Country Lane<br />
                                    Meadowbrook, SA 1234
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Phone size={16} />
                                <span className="text-sm">+27 12 345 6789</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Mail size={16} />
                                <span className="text-sm">info@meadowbrookequestrian.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-green-600 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
                    <p className="text-green-200 text-sm">
                        © 2024 Meadowbrook Equestrian. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-1 text-green-200 text-sm mt-2 sm:mt-0">
                        <span>Made with</span>
                        <Heart size={14} className="text-pink-400" />
                        <span>for horse lovers</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
