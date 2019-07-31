import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver import ActionChains

class EndToEndTests(unittest.TestCase):
    def setUp(self):
        self.driver = webdriver.Firefox()

    def test_click_year_sort_button(self):
        driver = self.driver
        driver.get("http://localhost:3000/action/looper2012")
        elem = driver.find_element_by_id('year-sort-button')
        elem.click()

        # action_chains = ActionChains(driver)
        # action_chains.move_to_element(elem).perform()

    def tearDown(self):
        self.driver.close()

if __name__ == "__main__":
    unittest.main()
