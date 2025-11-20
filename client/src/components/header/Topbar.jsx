// components/header/TopBar.jsx
import React, { useEffect, useState } from 'react';
import { FaFacebookF, FaInstagram, FaTwitter, FaWhatsapp } from 'react-icons/fa';

const TopBar = () => {
	const [hide, setHide] = useState(false);

	useEffect(() => {
		let lastScroll = window.scrollY;
		const onScroll = () => {
			const current = window.scrollY;
			setHide(current > lastScroll && current > 40);
			lastScroll = current;
		};
		window.addEventListener('scroll', onScroll);
		return () => window.removeEventListener('scroll', onScroll);
	}, []);

	const date = new Date().toLocaleDateString('en-NG', {
		weekday: 'long',
		year: 'numeric',
		month: 'short',
		day: 'numeric',
	});

	return (
		<div
			className={`bg-gray-100 text-xs md:text-sm text-gray-700 px-4 py-2 flex flex-col md:flex-row justify-between items-center gap-2 transition-all duration-300 z-40 ${
				hide ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
			} fixed w-full top-0 md:static`}
		>
			<span>{date}</span>

			<div className="flex flex-wrap justify-center items-center gap-3 text-gray-600 text-xs">
				<span className="text-center">Connect Nigeria | News • Jobs • Gist</span>
				<div className="flex gap-2 text-sm">
					<FaFacebookF className="hover:text-blue-600 cursor-pointer" />
					<FaTwitter className="hover:text-blue-500 cursor-pointer" />
					<FaInstagram className="hover:text-pink-600 cursor-pointer" />
					<FaWhatsapp className="hover:text-green-600 cursor-pointer" />
				</div>
			</div>
		</div>
	);
};

export default TopBar;
